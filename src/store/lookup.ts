import {Browser, Page, Response} from 'puppeteer';
import {Link, Store} from './model';
import {Print, logger} from '../logger';
import {Selector, cardPrice, pageIncludesLabels} from './includes-labels';
import {closePage, delay, getRandomUserAgent, getSleepTime, isStatusCodeInRange} from '../util';
import {config} from '../config';
import {disableBlockerInPage} from '../adblocker';
import {fetchLinks} from './fetch-links';
import {filterStoreLink} from './filter';
import {processBackoffDelay} from './model/helpers/backoff';
import {sendNotification} from '../notification';
import {purchase} from './purchase';
import * as fs from 'fs';

const inStock: Record<string, boolean> = {};

const linkBuilderLastRunTimes: Record<string, number> = {};

/**
 * Responsible for looking up information about a each product within
 * a `Store`. It's important that we ignore `no-await-in-loop` here
 * because we don't want to get rate limited within the same store.
 *
 * @param browser Puppeteer browser.
 * @param store Vendor of graphics cards.
 */
async function lookup(browser: Browser, store: Store) {
	/* eslint-disable no-await-in-loop */
	for (const link of store.links) {
		if (link.isPurchased) {
			continue;
		}

		if (!filterStoreLink(link)) {
			continue;
		}

		if (config.page.inStockWaitTime && inStock[link.url]) {
			logger.info(Print.inStockWaiting(link, store, true));
			continue;
		}

		const context = (config.browser.isIncognito ? await browser.createIncognitoBrowserContext() : browser.defaultBrowserContext());
		let page: Page;
		if (config.browser.isIncognito) {
			page = await context.newPage();
		} else {
			page = await browser.newPage();
		}

		page.setDefaultNavigationTimeout(config.page.timeout);
		await page.setExtraHTTPHeaders({
			'Accept-Language': 'en-US,en;q=0.9',
			'Cache-Control': 'max-age=0',
			Referer: 'https://www.google.com/',
			Accept: 'application/json,text/javascript,text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
			'Access-Control-Allow-Origin': '*',
			Connection: 'keep-alive',
			Pragma: 'no-cache',
			'Sec-Fetch-Dest': 'empty',
			'Sec-Fetch-Mode': 'cors'
		});
		if (store.headers) {
			await page.setExtraHTTPHeaders(store.headers);
		}

		await page.setUserAgent(getRandomUserAgent());
		await page.evaluateOnNewDocument(fs.readFileSync('./preload.txt', 'utf8'));

		if (store.disableAdBlocker) {
			try {
				await disableBlockerInPage(page);
			} catch (error) {
				logger.error(error);
			}
		}

		if (config.store.shouldLogin) {
			const cookiesFilePath = `cookies/${store.name}.json`;
			if (store.loginURL) {
				if (!config.store.shouldLoginOnce) {
					// This will catch all redirects to the login page as well as logging in for the first time
					page.on('load', async () => {
						if (store.login) {
							const cookies = await store.login(page);
							fs.writeFile(cookiesFilePath, JSON.stringify(cookies), () => {
								logger.info(`Successfully logged in and stored session cookies at ${cookiesFilePath}`);
							});
						}
					});
					await page.goto(store.loginURL, {waitUntil: 'networkidle0'});
				} else if (store.login) {
					await page.goto(store.loginURL, {waitUntil: 'networkidle0'});
					await store.login(page);
				}
			} else {
				logger.warn(`Couldn't login to ${store.name}. No function to login implemented!`);
			}
		}

		let statusCode = 0;

		try {
			statusCode = await lookupCard(browser, store, page, link);
		} catch (error) {
			logger.error(`✖ [${store.name}] ${link.brand} ${link.series} ${link.model} - ${error.message as string}`);
			const client = await page.target().createCDPSession();
			await client.send('Network.clearBrowserCookies');
			await client.send('Network.clearBrowserCache');
		}

		if (link.isPurchased) {
			// Don't close page
			logger.info(`Not closing page ${page.url()} after purchasing ${link.model} from ${store.name}`);
			return;
		}

		// Must apply backoff before closing the page, e.g. if CloudFlare is
		// used to detect bot traffic, it introduces a 5 second page delay
		// before redirecting to the next page
		await processBackoffDelay(store, link, statusCode);
		await closePage(page);
		if (config.browser.isIncognito) {
			await context.close();
		}
	}
	/* eslint-enable no-await-in-loop */
}

async function lookupCard(browser: Browser, store: Store, page: Page, link: Link): Promise<number> {
	const givenWaitFor = store.waitUntil ? store.waitUntil : 'networkidle0';

	if (config.store.onlyPurchase) {
		logger.verbose(`Directly going to item ${link.model} in ${store.name}`);
		try {
			if (!link.cartUrl) {
				await page.goto(link.url, {waitUntil: givenWaitFor});
			}

			await purchase(browser, store, page, link);
			link.isPurchased = true;
		} catch (error) {
			logger.info(`Couldn't purchase ${link.brand}. Item may not be in stock. ${JSON.stringify(error)}`);
		}

		return 200;
	}

	const response: Response | null = await page.goto(link.url, {waitUntil: givenWaitFor});
	if (!response) {
		logger.debug(Print.noResponse(link, store, true));
	}

	const successStatusCodes = store.successStatusCodes ?? [[0, 399]];
	const statusCode = response?.status() ?? 0;
	if (!isStatusCodeInRange(statusCode, successStatusCodes)) {
		if (statusCode === 429) {
			logger.warn(Print.rateLimit(link, store, true));
		} else {
			logger.warn(Print.badStatusCode(link, store, statusCode, true));
		}

		return statusCode;
	}

	if (await lookupCardInStock(store, page, link)) { // If true, then item is in stock
		// Param cartUrl is the url that adds the item to cart
		const givenUrl = link.cartUrl ? link.cartUrl : link.url;
		logger.info(`${Print.inStock(link, store, true)}\n${givenUrl}`);

		if (config.browser.open) {
			try {
				await purchase(browser, store, page, link);
				link.isPurchased = true;
			} catch {
				logger.info(`Couldn't purchase ${link.brand} even though it was in stock :(`);
			}
		}

		sendNotification(link, store);

		if (config.page.inStockWaitTime) {
			inStock[link.url] = true;

			setTimeout(() => {
				inStock[link.url] = false;
			}, 1000 * config.page.inStockWaitTime);
		}

		if (config.page.screenshot) {
			logger.debug('ℹ saving screenshot');

			link.screenshot = `success-${Date.now()}.png`;
			await page.screenshot({path: link.screenshot});
		}
	}

	return statusCode;
}

async function lookupCardInStock(store: Store, page: Page, link: Link) {
	const baseOptions: Selector = {
		requireVisible: false,
		selector: store.labels.container ?? 'body',
		type: 'textContent'
	};

	if (store.labels.inStock) {
		const options = {...baseOptions, requireVisible: true, type: 'outerHTML' as const};

		if (!await pageIncludesLabels(page, store.labels.inStock, options)) {
			logger.info(Print.outOfStock(link, store, true));
			return false;
		}
	}

	if (store.labels.outOfStock) {
		if (await pageIncludesLabels(page, store.labels.outOfStock, baseOptions)) {
			logger.info(Print.outOfStock(link, store, true));
			return false;
		}
	}

	if (store.labels.bannedSeller) {
		if (await pageIncludesLabels(page, store.labels.bannedSeller, baseOptions)) {
			logger.warn(Print.bannedSeller(link, store, true));
			return false;
		}
	}

	if (store.labels.maxPrice) {
		const price = await cardPrice(page, store.labels.maxPrice, config.store.maxPrice.series[link.series], baseOptions);
		const maxPrice = config.store.maxPrice.series[link.series];
		if (price) {
			logger.info(Print.maxPrice(link, store,	price, maxPrice, true));
			return false;
		}
	}

	if (store.labels.captcha) {
		if (await pageIncludesLabels(page, store.labels.captcha, baseOptions)) {
			logger.warn(Print.captcha(link, store, true));
			await delay(getSleepTime(store));
			return false;
		}
	}

	// Do API inventory validation in realtime (no cache) if available
	if (store.realTimeInventoryLookup !== undefined && link.itemNumber !== undefined) {
		return store.realTimeInventoryLookup(link.itemNumber);
	}

	return true;
}

export async function tryLookupAndLoop(browser: Browser, store: Store) {
	if (!browser.isConnected()) {
		logger.debug(`[${store.name}] Ending this loop as browser is disposed...`);
		return;
	}

	if (store.linksBuilder) {
		const lastRunTime = linkBuilderLastRunTimes[store.name] ?? -1;
		const ttl = store.linksBuilder.ttl ?? Number.MAX_SAFE_INTEGER;
		if (lastRunTime === -1 || (Date.now() - lastRunTime) > ttl) {
			try {
				await fetchLinks(store, browser);
				linkBuilderLastRunTimes[store.name] = Date.now();
			} catch (error) {
				logger.error(error.message);
			}
		}
	}

	logger.debug(`[${store.name}] Starting lookup...`);
	try {
		await lookup(browser, store);
	} catch (error) {
		logger.error(error);
	}

	const sleepTime = getSleepTime(store);
	logger.debug(`[${store.name}] Lookup done, next one in ${sleepTime} ms`);
	setTimeout(tryLookupAndLoop, sleepTime, browser, store);
}
