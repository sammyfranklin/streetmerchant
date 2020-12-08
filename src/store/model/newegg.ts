import {Store} from './store';
import {Page, Frame} from 'puppeteer';
import fetch from 'node-fetch';
import {config} from '../../config';
import {logger} from '../../logger';

export const Newegg: Store = {
	labels: {
		captcha: {
			container: 'body',
			text: ['are you a human?']
		},
		inStock: {
			container: 'div#ProductBuy .btn-primary',
			text: ['add to cart']
		},
		maxPrice: {
			container: 'div#app div.product-price > ul > li.price-current > strong',
			euroFormat: false
		},
		inCart: {
			container: 'div.message.message-success.message-added',
			text: ['Item has been added to cart.']
		}
	},
	links: [
		{
			brand: 'test:brand',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16811139156',
			itemNumber: '14-500-495',
			model: 'test:model',
			series: 'test:series',
			url: 'https://www.newegg.com/msi-geforce-rtx-2060-rtx-2060-ventus-xs-6g-oc/p/N82E16811139156'
		},
		{
			brand: 'amd',
			cartUrl: '',
			itemNumber: '',
			model: '',
			series: 'rx6900xt',
			url: ''
		},
		{
			brand: 'asus',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814126453',
			itemNumber: '14-126-453',
			model: 'tuf',
			series: '3080',
			url: 'https://www.newegg.com/asus-geforce-rtx-3080-tuf-rtx3080-10g-gaming/p/N82E16814126453'
		},
		{
			brand: 'evga',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814487518',
			itemNumber: '14-487-518',
			model: 'ftw3 ultra',
			series: '3080',
			url: 'https://www.newegg.com/evga-geforce-rtx-3080-10g-p5-3897-kr/p/N82E16814487518'
		},
		{
			brand: 'evga',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814487519',
			itemNumber: '14-487-519',
			model: 'ftw3',
			series: '3080',
			url: 'https://www.newegg.com/evga-geforce-rtx-3080-10g-p5-3895-kr/p/N82E16814487519'
		},
		{
			brand: 'evga',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814487522',
			itemNumber: '14-487-522',
			model: 'xc3 black',
			series: '3080',
			url: 'https://www.newegg.com/evga-geforce-rtx-3080-10g-p5-3881-kr/p/N82E16814487522'
		},
		{
			brand: 'evga',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814487521',
			itemNumber: '14-487-521',
			model: 'xc3',
			series: '3080',
			url: 'https://www.newegg.com/evga-geforce-rtx-3080-10g-p5-3883-kr/p/N82E16814487521'
		},
		{
			brand: 'msi',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814137600',
			itemNumber: '14-137-600',
			model: 'ventus 3x',
			series: '3080',
			url: 'https://www.newegg.com/msi-geforce-rtx-3080-rtx-3080-ventus-3x-10g/p/N82E16814137600'
		},
		{
			brand: 'msi',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814137598',
			itemNumber: '14-137-598',
			model: 'ventus 3x oc',
			series: '3080',
			url: 'https://www.newegg.com/msi-geforce-rtx-3080-rtx-3080-ventus-3x-10g-oc/p/N82E16814137598'
		},
		{
			brand: 'msi',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814137597',
			itemNumber: '14-137-597',
			model: 'gaming x trio',
			series: '3080',
			url: 'https://www.newegg.com/msi-geforce-rtx-3080-rtx-3080-gaming-x-trio-10g/p/N82E16814137597'
		},
		{
			brand: 'gigabyte',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814932329',
			itemNumber: '149-32-329',
			model: 'gaming oc',
			series: '3080',
			url: 'https://www.newegg.com/gigabyte-geforce-rtx-3080-gv-n3080gaming-oc-10gd/p/N82E16814932329'
		},
		{
			brand: 'gigabyte',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814932330',
			itemNumber: '149-32-330',
			model: 'eagle oc',
			series: '3080',
			url: 'https://www.newegg.com/gigabyte-geforce-rtx-3080-gv-n3080eagle-oc-10gd/p/N82E16814932330'
		},
		{
			brand: 'gigabyte',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814932336',
			itemNumber: '14-932-336',
			model: 'aorus master',
			series: '3080',
			url: 'https://www.newegg.com/gigabyte-geforce-rtx-3080-gv-n3080aorus-m-10gd/p/N82E16814932336'
		},
		{
			brand: 'zotac',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814500502',
			itemNumber: '14-950-502',
			model: 'trinity',
			series: '3080',
			url: 'https://www.newegg.com/zotac-geforce-rtx-3080-zt-a30800d-10p/p/N82E16814500502'
		},
		{
			brand: 'asus',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814126457',
			itemNumber: '14-126-457',
			model: 'rog strix',
			series: '3080',
			url: 'https://www.newegg.com/asus-geforce-rtx-3080-rog-strix-rtx3080-o10g-gaming/p/N82E16814126457'
		},
		{
			brand: 'asus',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814126452',
			itemNumber: '14-126-452',
			model: 'tuf oc',
			series: '3080',
			url: 'https://www.newegg.com/asus-geforce-rtx-3080-tuf-rtx3080-o10g-gaming/p/N82E16814126452'
		},
		{
			brand: 'zotac',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814500504',
			itemNumber: '14-500-504',
			model: 'trinity oc',
			series: '3080',
			url: 'https://www.newegg.com/zotac-geforce-rtx-3080-zt-t30800j-10p/p/N82E16814500504'
		},
		{
			brand: 'pny',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814133809',
			itemNumber: '14-133-809',
			model: 'xlr8 rgb',
			series: '3080',
			url: 'https://www.newegg.com/pny-geforce-rtx-3080-vcg308010tfxppb/p/N82E16814133809'
		},
		{
			brand: 'asus',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814126455',
			itemNumber: '14-126-455',
			model: 'tuf',
			series: '3090',
			url: 'https://www.newegg.com/asus-geforce-rtx-3090-tuf-rtx3090-24g-gaming/p/N82E16814126455'
		},
		{
			brand: 'asus',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814126456',
			itemNumber: '14-126-456',
			model: 'rog strix',
			series: '3090',
			url: 'https://www.newegg.com/asus-geforce-rtx-3090-rog-strix-rtx3090-o24g-gaming/p/N82E16814126456'
		},
		{
			brand: 'msi',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814137595',
			itemNumber: '14-137-595',
			model: 'gaming x trio',
			series: '3090',
			url: 'https://www.newegg.com/msi-geforce-rtx-3090-rtx-3090-gaming-x-trio-24g/p/N82E16814137595'
		},
		{
			brand: 'msi',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814137596',
			itemNumber: '14-137-596',
			model: 'ventus 3x oc',
			series: '3090',
			url: 'https://www.newegg.com/msi-geforce-rtx-3090-rtx-3090-ventus-3x-24g-oc/p/N82E16814137596'
		},
		{
			brand: 'zotac',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814500503',
			itemNumber: '14-500-503',
			model: 'trinity',
			series: '3090',
			url: 'https://www.newegg.com/zotac-geforce-rtx-3090-zt-a30900d-10p/p/N82E16814500503'
		},
		{
			brand: 'msi',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814137599',
			itemNumber: '14-137-599',
			model: 'ventus 3x',
			series: '3090',
			url: 'https://www.newegg.com/msi-geforce-rtx-3090-rtx-3090-ventus-3x-24g/p/N82E16814137599'
		},
		{
			brand: 'evga',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814487525',
			itemNumber: '14-487-525',
			model: 'ftw3',
			series: '3090',
			url: 'https://www.newegg.com/evga-geforce-rtx-3090-24g-p5-3985-kr/p/N82E16814487525'
		},
		{
			brand: 'evga',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814487524',
			itemNumber: '14-487-524',
			model: 'xc3 ultra',
			series: '3090',
			url: 'https://www.newegg.com/evga-geforce-rtx-3090-24g-p5-3975-kr/p/N82E16814487524'
		},
		{
			brand: 'evga',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814487526',
			itemNumber: '14-487-526',
			model: 'ftw3 ultra',
			series: '3090',
			url: 'https://www.newegg.com/evga-geforce-rtx-3090-24g-p5-3987-kr/p/N82E16814487526'
		},
		{
			brand: 'evga',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814487527',
			itemNumber: '14-487-527',
			model: 'xc3 black',
			series: '3090',
			url: 'https://www.newegg.com/evga-geforce-rtx-3090-24g-p5-3971-kr/p/N82E16814487527'
		},
		{
			brand: 'evga',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814487523',
			itemNumber: '14-487-523',
			model: 'xc3',
			series: '3090',
			url: 'https://www.newegg.com/evga-geforce-rtx-3090-24g-p5-3973-kr/p/N82E16814487523'
		},
		{
			brand: 'gigabyte',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814932327',
			itemNumber: '14-932-327',
			model: 'gaming',
			series: '3090',
			url: 'https://www.newegg.com/gigabyte-geforce-rtx-3090-gv-n3090gaming-oc-24gd/p/N82E16814932327'
		},
		{
			brand: 'gigabyte',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814932328',
			itemNumber: '14-932-328',
			model: 'eagle',
			series: '3090',
			url: 'https://www.newegg.com/gigabyte-geforce-rtx-3090-gv-n3090eagle-oc-24gd/p/N82E16814932328'
		},
		{
			brand: 'msi',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814137601',
			itemNumber: '14-137-601',
			model: 'ventus 3x oc',
			series: '3070',
			url: 'https://www.newegg.com/msi-geforce-rtx-3070-rtx-3070-ventus-3x-oc/p/N82E16814137601'
		},
		{
			brand: 'msi',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814137602',
			itemNumber: '14-137-602',
			model: 'ventus 2x oc',
			series: '3070',
			url: 'https://www.newegg.com/msi-geforce-rtx-3070-rtx-3070-ventus-2x-oc/p/N82E16814137602'
		},
		{
			brand: 'msi',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814137603',
			itemNumber: '14-137-603',
			model: 'gaming x trio',
			series: '3070',
			url: 'https://www.newegg.com/msi-geforce-rtx-3070-rtx-3070-gaming-x-trio/p/N82E16814137603'
		},
		{
			brand: 'gigabyte',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814932360',
			itemNumber: '14-932-360',
			model: 'vision oc',
			series: '3070',
			url: 'https://www.newegg.com/gigabyte-geforce-rtx-3070-gv-n3070vision-oc-8gd/p/N82E16814932360'
		},
		{
			brand: 'asus',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814126459',
			itemNumber: '14-126-459',
			model: 'dual oc',
			series: '3070',
			url: 'https://www.newegg.com/asus-geforce-rtx-3070-dual-rtx3070-o8g/p/N82E16814126459'
		},
		{
			brand: 'asus',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814126458',
			itemNumber: '14-126-458',
			model: 'rog strix',
			series: '3070',
			url: 'https://www.newegg.com/asus-geforce-rtx-3070-rog-strix-rtx3070-o8g-gaming/p/N82E16814126458'
		},
		{
			brand: 'zotac',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814500501',
			itemNumber: '14-500-501',
			model: 'twin edge',
			series: '3070',
			url: 'https://www.newegg.com/zotac-geforce-rtx-3070-zt-a30700e-10p/p/N82E16814500501'
		},
		{
			brand: 'zotac',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814500505',
			itemNumber: '14-500-505',
			model: 'twin edge oc',
			series: '3070',
			url: 'https://www.newegg.com/zotac-geforce-rtx-3070-zt-a30700h-10p/p/N82E16814500505'
		},
		{
			brand: 'gigabyte',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814932342',
			itemNumber: '14-932-342',
			model: 'gaming oc',
			series: '3070',
			url: 'https://www.newegg.com/gigabyte-geforce-rtx-3070-gv-n3070gaming-oc-8gd/p/N82E16814932342'
		},
		{
			brand: 'evga',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814487532',
			itemNumber: '14-487-532',
			model: 'ftw3 ultra',
			series: '3070',
			url: 'https://www.newegg.com/evga-geforce-rtx-3070-08g-p5-3767-kr/p/N82E16814487532'
		},
		{
			brand: 'evga',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814487530',
			itemNumber: '14-487-530',
			model: 'xc3 ultra',
			series: '3070',
			url: 'https://www.newegg.com/evga-geforce-rtx-3070-08g-p5-3755-kr/p/N82E16814487530'
		},
		{
			brand: 'evga',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814487528',
			itemNumber: '14-487-528',
			model: 'xc3 black',
			series: '3070',
			url: 'https://www.newegg.com/evga-geforce-rtx-3070-08g-p5-3751-kr/p/N82E16814487528'
		},
		{
			brand: 'gigabyte',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814932343',
			itemNumber: '14-932-343',
			model: 'eagle oc',
			series: '3070',
			url: 'https://www.newegg.com/gigabyte-geforce-rtx-3070-gv-n3070eagle-oc-8gd/p/N82E16814932343'
		},
		{
			brand: 'gigabyte',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814932344',
			itemNumber: '14-932-344',
			model: 'eagle',
			series: '3070',
			url: 'https://www.newegg.com/gigabyte-geforce-rtx-3070-gv-n3070eagle-8gd/p/N82E16814932344'
		},
		{
			brand: 'evga',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814487529',
			itemNumber: '14-487-529',
			model: 'xc3',
			series: '3070',
			url: 'https://www.newegg.com/evga-geforce-rtx-3070-08g-p5-3753-kr/p/N82E16814487529'
		},
		{
			brand: 'asus',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814126460',
			itemNumber: '14-126-460',
			model: 'dual',
			series: '3070',
			url: 'https://www.newegg.com/asus-geforce-rtx-3070-dual-rtx3070-8g/p/N82E16814126460'
		},
		{
			brand: 'gigabyte',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814932359',
			itemNumber: '14-932-359',
			model: 'aorus master',
			series: '3070',
			url: 'https://www.newegg.com/gigabyte-geforce-rtx-3070-gv-n3070aorus-m-8gd/p/N82E16814932359'
		},
		{
			brand: 'evga',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814487531',
			itemNumber: '14-487-531',
			model: 'ftw3',
			series: '3070',
			url: 'https://www.newegg.com/evga-geforce-rtx-3070-08g-p5-3765-kr/p/N82E16814487531'
		},
		{
			brand: 'asus',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16814126461',
			itemNumber: '14-126-461',
			model: 'tuf oc',
			series: '3070',
			url: 'https://www.newegg.com/asus-geforce-rtx-3070-tuf-rtx3070-o8g-gaming/p/N82E16814126461'
		},
		{
			brand: 'amd',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16819113663',
			itemNumber: '19-113-663',
			model: '5950x',
			series: 'ryzen5950',
			url: 'https://www.newegg.com/amd-ryzen-9-5950x/p/N82E16819113663'
		},
		{
			brand: 'amd',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16819113664',
			itemNumber: '19-113-664',
			model: '5900x',
			series: 'ryzen5900',
			url: 'https://www.newegg.com/amd-ryzen-9-5900x/p/N82E16819113664'
		},
		{
			brand: 'amd',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16819113665',
			itemNumber: '19-113-665',
			model: '5800x',
			series: 'ryzen5800',
			url: 'https://www.newegg.com/amd-ryzen-9-5900x/p/N82E16819113665'
		},
		{
			brand: 'amd',
			cartUrl: 'https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=N82E16819113666',
			itemNumber: '19-113-666',
			model: '5600x',
			series: 'ryzen5600',
			url: 'https://www.newegg.com/amd-ryzen-5-5600x/p/N82E16819113666'
		}
	],
	name: 'newegg',
	realTimeInventoryLookup: async (itemNumber: string) => {
		const request_url = 'https://www.newegg.com/product/api/ProductRealtime?ItemNumber=' + itemNumber;
		const response = await fetch(request_url);
		const response_json = await response.json();
		return response_json.MainItem !== undefined && response_json.MainItem.Instock === true;
	},
	loginURL: 'https://secure.newegg.com/NewMyAccount/AccountLogin.aspx?nextpage=https%3A%2F%2Fwww.newegg.com%2F',
	login: async (page: Page) => {
		const credentials = config.credentials.find(cred => cred.name === 'newegg');
		if (!credentials) {
			return page.cookies();
		}

		const usernameSelector = '#labeled-input-signEmail';
		const passwordSelector = '#labeled-input-password';
		const submitSelector = '#signInSubmit';
		// Newegg forces new pages to go to sign in page twice
		await page.goto('https://secure.newegg.com/NewMyAccount/AccountLogin.aspx?nextpage=https%3A%2F%2Fwww.newegg.com%2F', {waitUntil: 'networkidle0'});
		await page.waitForSelector(usernameSelector);
		await page.focus(usernameSelector);
		await page.keyboard.type(credentials.username);
		await page.click(submitSelector);
		await page.waitForSelector(passwordSelector);
		await page.focus(passwordSelector);
		await page.keyboard.type(credentials.password);
		await page.click(submitSelector);
		await page.waitForNavigation({waitUntil: 'networkidle0'});
		return page.cookies();
	},
	addToCart: async (page: Page) => {
		const selector = '#ProductBuy > .nav-row > .nav-col > button.btn-wide';
		await page.click(selector);
		await page.waitForSelector('body[style=\'overflow: hidden;\']');
	},
	goToCheckout: async (page: Page) => {
		const cartUrl = 'https://secure.newegg.com/shop/cart';
		const checkoutSelector = '.summary-actions button.btn-primary';
		const step2Selector = '#app > div > section > div > div > form > div.row-inner > div.row-body > div > div:nth-child(2) > div > div.checkout-step-action > button';
		const cvvSelector = '.item-cell > .checkout-step[data-status=add] input.mask-cvv-4';
		const retypeCvvSelctor = '.retype-security-code > input';
		const step3Selector = '#app > div > section > div > div > form > div.row-inner > div.row-body > div > div:nth-child(3) > div > div.checkout-step-action > button';
		const ccnumberRetypeFrame = 'ec_payment';
		const ccnumberRetypeSelector = '#app > div > div.modal-body > div.form-cells > div:nth-child(1) > input';
		const ccnumberRetypeSaveSelector = '#app > div > div.modal-footer > button.btn.btn-primary';
		const placeOrderSelector = '#btnCreditCard';
		const interval = 50;

		// Cart
		await page.goto(cartUrl, {waitUntil: 'domcontentloaded'});
		// Checkout
		await page.click(checkoutSelector);
		// Step 1 (automatically skipped)
		await page.waitForNavigation({waitUntil: 'networkidle0'});
		// Step 2
		let shouldRetypeCvv = false;
		try {
			await page.click(step2Selector);
		} catch {
			logger.verbose('Step 2 was skipped');
			shouldRetypeCvv = true;
		}

		// Step 3
		if (shouldRetypeCvv) {
			await page.waitForSelector(retypeCvvSelctor);
			await page.focus(retypeCvvSelctor);
			await page.keyboard.type(config.card.cvv);
		} else {
			await page.waitForSelector(cvvSelector);
			await page.focus(cvvSelector);
			await page.keyboard.type(config.card.cvv);
			await page.click(step3Selector);
		}

		// Poll for either ccnumber retype or payment selector
		await new Promise(resolve => {
			setTimeout(async () => checkCCNumberRetype(resolve), interval);
		});
		logger.verbose('Placed order!');

		async function checkCCNumberRetype(callback: () => void) {
			const frames: Frame[] = page.frames();
			const frame = frames.find(frame => frame.name().includes(ccnumberRetypeFrame)) as Frame;
			if (frame && await frame.$(ccnumberRetypeSelector)) {
				await frame.focus(ccnumberRetypeSelector);
				await page.keyboard.type(config.card.number);
				await frame.click(ccnumberRetypeSaveSelector);
				await checkPayment();
				return callback();
			}

			setTimeout(async () => checkPayment(callback), interval);
		}

		async function checkPayment(callback: (() => void) | null = null) {
			if (callback) {
				if (await page.$(placeOrderSelector)) {
					logger.verbose('Placing order...');
					await page.click(placeOrderSelector);
				} else {
					setTimeout(async () => checkCCNumberRetype(callback), interval);
				}
			} else {
				await page.waitForSelector(placeOrderSelector);
				logger.verbose('Placing order...');
				await page.click(placeOrderSelector);
			}
		}
	}
};
