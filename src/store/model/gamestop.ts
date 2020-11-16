import {Store} from './store';
import {Page} from 'puppeteer';
import {config} from '../../config';
import {logger} from '../../logger';
import {delay} from '../../util';

export const Gamestop: Store = {
	labels: {
		inStock: [
			{
				container: '.add-to-cart',
				text: ['add to cart']
			},
			{
				container: '.add-to-cart',
				text: ['Pre-Order']
			}
		],
		maxPrice: {
			container: '.primary-details-row .actual-price',
			euroFormat: false
		},
		outOfStock: {
			container: '.add-to-cart',
			text: ['not available']
		}
	},
	links: [
		{
			brand: 'test:brand',
			model: 'test:model',
			series: 'test:series',
			url: 'https://www.gamestop.com/nav-pc-hardware-desktops/products/clx-set-tgmsetgxe9600bm-gaming-desktop/11096665'
		},
		{
			brand: 'asus',
			model: 'tuf oc',
			series: '3080',
			url: 'https://www.gamestop.com/video-games/pc/components/graphics-cards/products/tuf-gaming-geforce-rtx-3080-graphics-card/11109446.html'
		},
		{
			brand: 'sony',
			model: 'ps5 console',
			series: 'sonyps5c',
			url: 'https://www.gamestop.com/video-games/playstation-5/consoles/products/playstation-5/11108140'
		},
		{
			brand: 'sony',
			model: 'ps5 digital',
			series: 'sonyps5de',
			url: 'https://www.gamestop.com/video-games/playstation-5/consoles/products/playstation-5-digital-edition/11108141'
		}
	],
	name: 'gamestop',
	successStatusCodes: [[0, 399], 404],
	loginURL: 'https://gamestop.com',
	login: async (page: Page) => {
		const credentials = config.credentials.find(cred => cred.name === 'gamestop');
		await page.click('a[href=\'#accountModal\']');
		await page.waitForSelector('#signIn');
		await page.click('#signIn');

		await page.waitForSelector('input#login-form-email');
		// Wait for ~1 second animation
		await delay(1000);
		await page.focus('input#login-form-email');
		if (credentials) {
			await page.keyboard.type(credentials.username, {delay: 110});
		}

		await page.focus('input#login-form-password');
		if (credentials) {
			await page.keyboard.type(credentials.password, {delay: 110});
		}

		await page.click('#signinCheck > button');
		await page.waitForSelector('a[href=\'https://www.gamestop.com/logout/\']');
		return page.cookies();
	},
	addToCart: async (page: Page) => {
		await page.click('.add-to-cart.btn-primary');
		logger.verbose('Added to cart');
	},
	goToCheckout: async (page: Page) => {
		await page.goto('https://www.gamestop.com/checkout/', {waitUntil: 'networkidle0'});
		await page.goto('https://www.gamestop.com/checkout/?stage=payment', {waitUntil: 'networkidle0'});
		logger.verbose('Adding card details');
		await page.focus('#saved-payment-security-code');
		await page.keyboard.type(config.card.cvv);
		await page.click('.submit-payment.btn-primary');
		await page.waitForSelector('.place-order.btn-primary');
		logger.verbose('Placing order!');
		await page.click('.place-order.btn-primary');
	}
};
