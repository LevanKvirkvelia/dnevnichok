import { Platform } from 'react-native';

export const defaultUserAgent =
	Platform.OS === 'ios'
		? 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1'
		: 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36';

export const sendMessageFn = `
	(function postMessage(getMessage) {
		if (window && window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
			window.ReactNativeWebView.postMessage(getMessage());
		} else {
			setTimeout(() => postMessage(getMessage), 100);
		}
	})
`;

export function functionCallToString(fn: string, ...args: any[]) {
	const argsStr = JSON.stringify(args);
	return `(${fn.toString()})(${argsStr.slice(1, argsStr.length - 1)})`;
}

export const waitForSelectorWebview = `function waitForSelectorWebview(selector, ignoreHidden) {
	const checkElement = () => {
		const element = document.querySelector(selector);

		return Boolean(ignoreHidden ? element && element.offsetParent : element);
	};

	if (checkElement()) {
		return Promise.resolve(true);
	}

	return new Promise(resolve => {
		const intervalId = setInterval(() => {
			if (checkElement()) {
				clearInterval(intervalId);
				resolve(true);
			}
		}, 1000);
	});
}`;

export const waitForTextWebview = `function waitForTextWebview(text, ignoreHidden) {
	const checkElement = () => {
		const element = document.evaluate(
			'//*[contains(text(),"' + text + '")]',
			document,
			null,
			XPathResult.FIRST_ORDERED_NODE_TYPE,
			null,
		).singleNodeValue;
		return Boolean(ignoreHidden ? element && element.offsetParent : element);
	};

	if (checkElement()) {
		return Promise.resolve(true);
	}

	return new Promise(resolve => {
		const intervalId = setInterval(() => {
			if (checkElement()) {
				clearInterval(intervalId);
				resolve(true);
			}
		}, 1000);
	});
}`;
