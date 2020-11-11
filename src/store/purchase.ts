import {Browser, Page} from 'puppeteer';
import {Link, Store} from './model';
import {logger} from '../logger';

export async function purchase(browser: Browser, store: Store, page: Page, link: Link): Promise<void> {
	logger.verbose(`Purchasing ${link.model} from ${store.name}`);
	if (link.cartUrl) {
		// Add item to cart
		const givenWaitFor = store.waitUntil ? store.waitUntil : 'networkidle0';
		await page.goto(link.cartUrl, {waitUntil: givenWaitFor});
		// Checkout
		if (store.goToCheckout) {
			await store.goToCheckout(page);
		}
	} else if (link.openCartAction) {
		await link.openCartAction(browser);
	}
}
