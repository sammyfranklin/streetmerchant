import {Browser, LoadEvent, Page} from 'puppeteer';

export type Element = {
	container?: string;
	text: string[];
};

export type Pricing = {
	container: string;
	euroFormat?: boolean;
};

export type Series = 'test:series' | '3070' | '3080' | '3090' | 'ryzen5950' | 'ryzen5900' | 'ryzen5800' | 'ryzen5600' | 'sonyps5c' | 'sonyps5de' | 'xboxseriesx' | 'xboxseriess';

export type Link = {
	brand: 'test:brand' | 'amd' | 'asus' | 'evga' | 'gainward' | 'gigabyte' | 'inno3d' | 'kfa2' | 'msi' | 'nvidia' | 'palit' | 'pny'| 'sony' | 'zotac' | 'microsoft';
	isPurchased?: boolean;
	itemNumber?: string;
	series: Series;
	model: string;
	url: string;
	cartUrl?: string;
	openCartAction?: (browser: Browser) => Promise<string>;
	screenshot?: string;
};

export type LabelQuery = Element[] | Element | string[];

export type Labels = {
	bannedSeller?: LabelQuery;
	captcha?: LabelQuery;
	container?: string;
	inStock?: LabelQuery;
	outOfStock?: LabelQuery;
	maxPrice?: Pricing;
	inCart?: LabelQuery;
};

export type StatusCodeRangeArray = Array<(number | [number, number])>;

export type Store = {
	realTimeInventoryLookup?: (itemNumber: string) => Promise<boolean>;
	/**
	 * The range of status codes which will trigger backoff, i.e. an increasing
	 * delay between requests. Setting an empty array will disable the feature.
	 * If not defined, the default range will be used: 403.
	 */
	backoffStatusCodes?: StatusCodeRangeArray;
	disableAdBlocker?: boolean;
	links: Link[];
	linksBuilder?: {
		builder: (docElement: cheerio.Cheerio, series: Series) => Link[];
		ttl?: number;
		urls: Array<{series: Series; url: string | string[]}>;
	};
	headers?: Record<string, string>;
	labels: Labels;
	name: string;
	checkoutURL?: string;
	loginURL?: string;
	login?: (page: Page) => Promise<unknown[]>;
	setupAction?: (browser: Browser) => void;
	addToCart?: (page: Page) => Promise<void>;
	goToCheckout?: (page: Page) => Promise<void>;
	/**
	 * The range of status codes which considered successful, i.e. without error
	 * allowing request parsing to continue. Setting an empty array will cause
	 * all requests to fail. If not defined, the default range will be used:
	 * 0 -> 399 inclusive.
	 */
	successStatusCodes?: StatusCodeRangeArray;
	waitUntil?: LoadEvent;
	minPageSleep?: number;
	maxPageSleep?: number;
};
