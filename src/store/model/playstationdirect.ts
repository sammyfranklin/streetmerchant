import {Store} from './store';
import {Page} from 'puppeteer';
import {config} from '../../config';
import {logger} from '../../logger';
import {delay} from '../../util';

export const PlaystationDirect: Store = {
	headers: {
		Referer: 'https://my.account.sony.com/'
	},
	labels: {
		inStock: [
			{
				container: '.add-to-cart',
				text: ['add']
			}
		]
	},
	links: [
		{
			brand: 'test:brand',
			model: 'test:model',
			series: 'test:series',
			url: 'https://direct.playstation.com/en-us/consoles/console/playstation-4-pro-1tb-console.3003346'
		},
		{
			brand: 'sony',
			model: 'ps5 console',
			series: 'sonyps5c',
			url: 'https://direct.playstation.com/en-us/consoles/console/playstation5-console.3005816'
		},
		{
			brand: 'sony',
			model: 'ps5 digital',
			series: 'sonyps5de',
			url: 'https://direct.playstation.com/en-us/consoles/console/playstation5-digital-edition-console.3005817'
		}
	],
	name: 'playstationdirect',
	successStatusCodes: [[0, 399], 404],
	loginURL: 'https://direct.playstation.com/en-us',
	login: async (page: Page): Promise<unknown[]> => {
		const credentials = config.credentials.find(cred => cred.name === 'playstationdirect');
		logger.verbose('Clicking sign in link');
		try {
			await page.waitForSelector('a.js-topnav-desktop-signin-link');
			await page.click('a.js-topnav-desktop-signin-link');
		} catch {
			logger.verbose('Couldn\'t find sign in link');
			return page.cookies();
		}

		logger.verbose('waiting for selector sign in link');
		await page.waitForSelector('input[type=email]');
		await page.focus('input[type=email]');

		if (credentials?.name) {
			await page.keyboard.type(credentials.username);
		}

		// Click Next
		await page.click('#ember21');
		// Wait for password to show up
		logger.verbose('waiting for password');
		await page.waitForSelector('input[type=password]');
		// Type password
		await page.focus('input[type=password]');
		if (credentials?.password) {
			await page.keyboard.type(credentials.password);
		}

		// Submit
		await page.click('#ember39');
		await page.waitForNavigation();

		return page.cookies();
	},
	addToCart: async (page: Page) => {
		try {
			await page.click('button.btn.transparent-orange-button.js-analyitics-tag.add-to-cart');
			await page.waitForSelector('a[data-module-name=mini-cart]');
		} catch (error) {
			logger.error(`Couldnt click add to cart ${JSON.stringify(error)}`);
		}
	},
	goToCheckout: async (page: Page) => {
		logger.verbose('Cart');
		await page.goto('https://direct.playstation.com/en-us/checkout?tab=cart', {waitUntil: 'networkidle0'});
		logger.verbose('Shipping');
		await page.goto('https://direct.playstation.com/en-us/checkout?tab=shipping', {waitUntil: 'networkidle0'});
		try {
			await page.click('.order-summary-container__cta > div > button');
			await page.waitForSelector('#cardNumber-container');

			logger.verbose('Payment');
			// Enter credit card number
			// Bypass security Cybersource iframe + script by emulating focus within iframe
			await page.evaluate(async () => {
				// Poll for input
				const input: HTMLInputElement = await new Promise(resolve => {
					let inputElement;
					const trySetInput = () => {
						const window = (document.querySelector('#cardNumber-container>iframe') as HTMLIFrameElement)?.contentWindow;
						inputElement = window?.document?.querySelector('input[type=tel]') as HTMLInputElement;
						if (inputElement) {
							return resolve(inputElement);
						}

						setTimeout(trySetInput, 50);
					};

					trySetInput();
				});
				input.focus();
			});
			logger.verbose('Focused iframe input. Now, typing.');
			await delay(110);
			await page.keyboard.type(config.card.number, {delay: 110});

			// Enter credit card details
			await page.focus('#accountHolderName');
			await page.keyboard.type(`${config.card.fname} ${config.card.mi} ${config.card.lname}`);
			await page.focus('#expiryMonth');
			await page.keyboard.type(config.card.exp[0]);
			await page.focus('#expiryYear');
			await page.keyboard.type(config.card.exp[1]);
			await page.focus('#cvvInput');
			await page.keyboard.type(config.card.cvv);
			// Assume billing address is the 2nd address
			await page.click('label[for=chooseFromSavedAddress]');
			await page.click('.billing-address__saved-address > div:nth-child(2) > div > div');

			// Review Order
			logger.verbose('Reviewing Order');
			// Bypass security script by emulating click in browser
			await page.evaluate(() => {
				const nextButton = document.querySelector('.order-summary-container__cta > div > button') as HTMLButtonElement;
				nextButton.click();
			});

			logger.verbose('Placing Order');
			await page.waitForSelector('.checkout-cta__place-order');
			logger.verbose('Found place order button');
			// Bypass security script by emulating click in browser
			await page.evaluate(() => {
				const placeOrderButton = document.querySelector('.checkout-cta__place-order') as HTMLButtonElement;
				placeOrderButton.click();
			});
		} catch (error) {
			logger.error(`Couldn't place order ${JSON.stringify(error)}`);
		}
	}
};
