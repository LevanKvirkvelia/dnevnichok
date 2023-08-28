import { RefObject } from 'react';
import WebView from 'react-native-webview';
import { WebFunctionsParams } from '../types';

export class DefaultFunctions {
	static DEFAULT_URL = ``;

	static DEFAULT_USER_AGENT =
		'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1';
	static params: { [key: string]: string } = {};
	static onNavigationStateChange(params: WebFunctionsParams) {
		return null;
	}

	static onShouldStartLoadWithRequest(params: {
		url: string;
		webview: RefObject<WebView>;
		setUrl: (url: string) => void;
	}) {
		console.log(params);
		if (
			params.url.includes('shrB2nKUhpZ35Cdtk') &&
			!params.url.includes('prefill') &&
			DefaultFunctions.params.airtableRedirect
		) {
			// webview.current.
			params.setUrl(DefaultFunctions.params.airtableRedirect);
			return false;
		}
		return true;
	}

	static onLoadEnd(params: WebFunctionsParams) {
		return null;
	}
}
