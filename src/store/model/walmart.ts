import {Store} from './store';
import {Page} from 'puppeteer';
import {config} from '../../config';
import {logger} from '../../logger';

export const Walmart: Store = {
	labels: {
		inStock: {
			container: '#ProductPrimaryCTA-cta_add_to_cart_button',
			text: ['Add to cart']
		},
		maxPrice: {
			container: 'span[class*="price-characteristic"]'
		},
		inCart: {
			container: 'button.checkoutBtn',
			text: ['Check out']
		}
	},
	links: [
		{
			brand: 'test:brand',
			model: 'test:model',
			series: 'test:series',
			url: 'https://www.walmart.com/ip/ZOTAC-GAMING-GeForce-RTX-2060-Black/341937837',
			cartUrl: 'http://affil.walmart.com/cart/buynow?items=341937837'
		},
		{
			brand: 'microsoft',
			model: 'Xbox Series X',
			series: 'xboxseriesx',
			url: 'https://www.walmart.com/ip/XB1-Xbox-Series-X/443574645',
			cartUrl: 'http://affil.walmart.com/cart/buynow?items=443574645'
		},
		{
			brand: 'microsoft',
			model: 'Xbox Series S',
			series: 'xboxseriess',
			url: 'https://www.walmart.com/ip/XB1-Xbox-Series-X/606518560',
			cartUrl: 'http://affil.walmart.com/cart/buynow?items=606518560'
		},
		{
			brand: 'sony',
			model: 'ps5 console',
			series: 'sonyps5c',
			url: 'https://www.walmart.com/ip/PlayStation5-Console/363472942',
			cartUrl: 'http://affil.walmart.com/cart/buynow?items=363472942'
		},
		{
			brand: 'sony',
			model: 'ps5 digital',
			series: 'sonyps5de',
			url: 'https://www.walmart.com/ip/Sony-PlayStation-5-Digital-Edition/493824815',
			cartUrl: 'http://affil.walmart.com/cart/buynow?items=493824815'
		}
	],
	name: 'walmart',
	loginURL: 'https://www.walmart.com/account/login',
	login: async (page: Page): Promise<unknown[]> => {
		const credentials = config.credentials.find(cred => cred.name === 'walmart');
		try {
			await page.focus('#email');
		} catch {
			// If no node for email, then try signin-email
			try {
				await page.focus('#sign-in-email');
			} catch {
				// If also doesn't work then is signed in already
				return page.cookies();
			}
		}

		if (credentials?.username) {
			await page.keyboard.type(credentials?.username);
		}

		try {
			await page.focus('#password');
		} catch {
			// If no node for id="password", then try type="password"
			await page.focus('input[type=password]');
		}

		if (credentials?.password) {
			await page.keyboard.type(credentials?.password);
		}

		await page.click('button.button[type=submit]');
		await page.waitForNavigation({waitUntil: 'networkidle0'});
		return page.cookies();
	},
	goToCheckout: async (page: Page): Promise<void> => {
		// Must be logged in to work
		const confirmItemsSelector = 'button.cxo-continue-btn.button--primary';
		const confirmDeliveryAddressSelector = 'button.button--primary[data-automation-id=address-book-action-buttons-on-continue]';
		const confirmCVVSelector = '#cvv-confirm';
		const reviewOrderSelector = '.fulfillment-opts-continue.button--primary';
		const confirmOrderSelector = '.place-order-btn.button--primary';
		try {
			logger.verbose('Going to checkout');
			await page.goto('https://www.walmart.com/checkout/#/', {waitUntil: 'domcontentloaded'});
			logger.verbose('At checkout. Waiting to confirm items....');
			// Confirm items
			await page.waitForSelector(confirmItemsSelector);
			logger.verbose('Clicking fulfillment continue');
			await page.click(confirmItemsSelector);

			// Confirm delivery
			await page.waitForSelector(confirmDeliveryAddressSelector);
			logger.verbose('Clicking delivery continue');
			await page.click(confirmDeliveryAddressSelector);

			// Confirm cvv
			await page.waitForSelector(confirmCVVSelector);
			logger.verbose('Confirming CVV');
			await page.focus(confirmCVVSelector);
			await page.keyboard.type(config.card.cvv);

			// Review order
			logger.verbose('Reviewing order');
			await page.click(reviewOrderSelector);

			// Place order
			await page.waitForSelector(confirmOrderSelector);
			logger.verbose('Confirming order');
			await page.click(confirmOrderSelector);
		} catch (error: any) {
			logger.verbose(`Couldn't checkout because of ${JSON.stringify(error)}`);
		}
	}
};
