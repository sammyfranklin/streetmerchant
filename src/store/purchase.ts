import {Browser, Page} from 'puppeteer';
import {Link, Store} from './model';
import {logger} from '../logger';
import {waitForSelectorIfAElseB} from '../util';
import {pageIncludesLabels, Selector} from './includes-labels';

export async function purchase(browser: Browser, store: Store, page: Page, link: Link): Promise<void> {
	logger.verbose(`Adding ${link.model} from ${store.name} to cart`);
	// Add item to cart
	await tryAddToCartContinually(page, store, link);

	// Checkout
	logger.verbose('Checking out');
	if (store.checkoutURL) {
		logger.verbose('Going to direct checkout url');
		await page.goto(store.checkoutURL, {waitUntil: 'networkidle0'});
	} else if (store.goToCheckout) {
		logger.verbose('Navigating to checkout using custom checkout method.');
		await store.goToCheckout(page);
	}
}

async function tryAddToCartContinually(page: Page, store: Store, link: Link) {
	await new Promise(async resolve => {
		if (link.cartUrl) {
			if (store.cartSelectors) {
				await page.goto(link.cartUrl, {waitUntil: 'domcontentloaded'});
				logger.verbose('Checking if item is in stock');
				if(await waitForSelectorIfAElseB(page, store.cartSelectors.inCart, store.cartSelectors.notInCart)) {
					logger.verbose('item in cart!');
					resolve();
				} else {
					logger.verbose('Item not in stock');
					setTimeout(async () => {
						if (!link.cartUrl && store.addToCart) {
							await page.reload();
						}
						await tryAddToCartContinually(page, store, link);
					}, 50);
				}
			} else {
				await page.goto(link.cartUrl, {waitUntil: 'networkidle0'});
			}
		} else if (store.addToCart) {
			await store.addToCart(page);
		}

		if (!store.cartSelectors && store.labels.inCart) {
			const baseOptions: Selector = {
				requireVisible: false,
				selector: 'body',
				type: 'textContent'
			};
			logger.verbose('Checking if in cart');
			if (await pageIncludesLabels(page, store.labels.inCart, baseOptions)) {
				resolve();
			} else {
				logger.verbose('Item not in stock');
				setTimeout(async () => {
					if (!link.cartUrl && store.addToCart) {
						await page.reload();
					}
					await tryAddToCartContinually(page, store, link);
				}, 50);
			}
		}
	});
}
