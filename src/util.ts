import {Browser, Page, Response} from 'puppeteer';
import {StatusCodeRangeArray, Store} from './store/model';
import {config} from './config';
import {disableBlockerInPage} from './adblocker';
import {logger} from './logger';

export function getSleepTime(store: Store) {
	const minSleep = store.minPageSleep as number;
	return minSleep + (Math.random() * ((store.maxPageSleep as number) - minSleep));
}

export async function delay(ms: number) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

export function isStatusCodeInRange(statusCode: number, range: StatusCodeRangeArray) {
	for (const value of range) {
		let min: number;
		let max: number;
		if (typeof value === 'number') {
			min = value;
			max = value;
		} else {
			[min, max] = value;
		}

		if (min <= statusCode && statusCode <= max) {
			return true;
		}
	}

	return false;
}

export async function usingResponse<T>(
	browser: Browser,
	url: string,
	cb: (response: (Response | null), page: Page, browser: Browser) => Promise<T>
): Promise<T> {
	return usingPage(browser, async (page, browser) => {
		const response = await page.goto(url, {waitUntil: 'domcontentloaded'});

		return cb(response, page, browser);
	});
}

export async function usingPage<T>(browser: Browser, cb: (page: Page, browser: Browser) => Promise<T>): Promise<T> {
	const page = await browser.newPage();
	page.setDefaultNavigationTimeout(config.page.timeout);
	await page.setUserAgent(getRandomUserAgent());

	try {
		return await cb(page, browser);
	} finally {
		try {
			await closePage(page);
		} catch (error) {
			logger.error(error);
		}
	}
}

export async function closePage(page: Page) {
	if (!config.browser.lowBandwidth) {
		await disableBlockerInPage(page);
	}

	await page.close();
}

export function getRandomUserAgent(): string {
	return config.page.userAgents[Math.floor(Math.random() * config.page.userAgents.length)];
}

export async function waitForSelectorOR(page: Page, ...selectors: string[]): Promise<void> {
	const waitFor = async (selectorIndex: number): Promise<void> => {
		return new Promise(async resolve => {
			if (await page.$(selectors[selectorIndex])) {
				resolve();
			} else {
				setTimeout(()=>resolve(waitFor((selectorIndex + 1) % selectors.length)), 50);
			}
		})
	};
	await waitFor(0);
}

export async function waitForSelectorIfAElseB(page: Page, selectorA: string, selectorB: string): Promise<boolean> {
	const waitForA = async (): Promise<boolean> => {
		return new Promise(async resolve => {
			try {
				if (await page.$(selectorA)) {
					resolve(true);
				} else {
					setTimeout(()=>resolve(waitForB()), 50);
				}
			} catch {
				setTimeout(()=>resolve(waitForA()), 50);
			}
		});
	};
	const waitForB = async (): Promise<boolean> => {
		return new Promise(async resolve => {
			try {
				if (await page.$(selectorB)) {
					resolve(false);
				} else {
					setTimeout(()=>resolve(waitForA()), 50);
				}
			} catch {
				setTimeout(()=>resolve(waitForB()), 50);
			}
		});
	};
	return await waitForA();
}

export async function indicateMouseClicks(page: Page) {
	await page.evaluate(() => {
		document.addEventListener('mousedown', (event: MouseEvent) => {
			console.log(`Recevied Mouse Click: ${JSON.stringify(event)}`);
			const square = document.createElement('div');
			const size = 10;
			const x = Math.floor(event.pageX - (size / 2));
			const y = Math.floor(event.pageY - (size / 2));
			square.style.position = 'absolute';
			square.style.top = `${y}px`;
			square.style.left = `${x}px`;
			square.style.width = size.toString();
			square.style.height = size.toString();
			square.style.backgroundColor = 'lightblue';
			document.body.append(square);
		});
	});
}
