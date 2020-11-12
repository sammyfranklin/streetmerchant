import {Browser, Page} from 'puppeteer';
import {Link, Store} from './model';
import {logger} from '../logger';

export async function purchase(browser: Browser, store: Store, page: Page, link: Link): Promise<void> {
	logger.verbose(`Adding ${link.model} from ${store.name} to cart`);
	const givenWaitFor = store.waitUntil ? store.waitUntil : 'networkidle0';
	// Add item to cart
	if (link.cartUrl) {
		await page.goto(link.cartUrl, {waitUntil: givenWaitFor});
	} else if (store.addToCart) {
		await store.addToCart(page);
	} else if (link.openCartAction) {
		await link.openCartAction(browser);
	}

	// Checkout
	logger.verbose('Checking out');
	if (store.checkoutURL) {
		logger.verbose('Going to direct checkout url');
		await page.goto(store.checkoutURL, {waitUntil: givenWaitFor});
	} else if (store.goToCheckout) {
		logger.verbose('Navigating to checkout w/o a direct url!');
		await store.goToCheckout(page);
	}
}
