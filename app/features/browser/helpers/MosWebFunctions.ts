import {RefObject} from 'react';
import WebView from 'react-native-webview';
import {WebFunctionsParams} from '../types';

export function evaluate(
  webview: RefObject<WebView>,
  func: string,
  ...args: any[]
) {
  const argsStr = JSON.stringify(args);
  const injectCode = `
		(function() {
			try {
				const resp = (${func.toString()})(${argsStr.slice(1, argsStr.length - 1)});
				window.ReactNativeWebView.postMessage(JSON.stringify(resp));
			} catch (e) {}
		})();
		true;`;
  webview?.current?.injectJavaScript(injectCode);
}

export class MosWebFunctions {
  static DEFAULT_URL = `https://school.mos.ru/v1/sudir/main/auth`;

  static DEFAULT_USER_AGENT =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1';

  static onShouldStartLoadWithRequest(params: {
    url: string;
    webview: RefObject<WebView>;
    setUrl: (url: string) => void;
  }) {
    return true;
  }

  static onNavigationStateChange({
    event,
    webview,
    account,
    setVisible,
  }: WebFunctionsParams) {
    const {url} = event;
    try {
      if (url?.includes('methods/password')) {
        setTimeout(
          () =>
            evaluate(
              webview,
              `function(login, password) {
								const $login = document.querySelector('input[name="login"]');
								$login.value = login;
								const $password = document.querySelector('input[name=password]');
								$password.value = password;
								const $form = document.querySelector('#loginFm');
								$form.submit();
							}`,
              account.authData.login,
              account.authData.password,
            ),
          1000,
        );
      }
      if (url.includes('student_diary/student_diary')) setVisible(true);
      if (url.indexOf('https://uchebnik.mos.ru/') === 0) {
        evaluate(
          webview,
          `function(){
					const interval = setInterval(() => {
						if (document.querySelector('iframe[src="https://uchebnik.mos.ru/studentpromo2020/"]')) {
							(document.querySelector('#modal-container') ).remove();
							clearInterval(interval);
						}
					}, 100);
				}`,
        );
      }
    } catch (e) {
      console.error('MosWebFunctions.onNavigationStateChange', e);
    }
  }

  static onLoadEnd({nextUrl, event, startUrl, webview}: WebFunctionsParams) {
    const {url} = event;
    if (
      (url.includes('student_diary') ||
        url.includes('desktop') ||
        url.includes('diary/diary')) &&
      nextUrl
    ) {
      setTimeout(
        () =>
          evaluate(
            webview,
            `function (_nextUrl) {
							document.location = _nextUrl;
						}`,
            nextUrl,
          ),
        2000,
      );
    }

    if (url.indexOf('https://dnevnik.mos.ru/') === 0) {
      evaluate(
        webview,
        `function (_startUrl) {
					const css = '.digital-banner-wrapper { display: none!important; }';
					const head = document.head || document.getElementsByTagName('head')[0];
					const style = document.createElement('style');
					const meta = document.createElement('meta');
					meta.name = 'viewport';
					meta.content = 'width=device-width, initial-scale=0.1';
					head.appendChild(style);
					if (_startUrl) head.appendChild(meta);
					style.appendChild(document.createTextNode(css));
				}`,
        startUrl,
      );
    }
  }
}
