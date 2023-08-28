import { MosWebFunctions } from './MosWebFunctions';
import { WebFunctionsParams } from '../types';

export class TatarWebFunctions extends MosWebFunctions {
	static DEFAULT_URL = `https://edu.tatar.ru/logon`;

	static DEFAULT_USER_AGENT =
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36';

	static onNavigationStateChange(params: WebFunctionsParams) {
		return null;
	}

	static onLoadEnd({ event, account, webview, setVisible }: WebFunctionsParams) {
		const { url } = event;
		if (url?.includes('/logon')) {
			const auth = `
				function dosearch(){
					try{
						var e = document.querySelector('input[type=text]');
						if(!e) return setTimeout(function(){dosearch();}, 100);
						e.value = "${account.authData.login}";
						e.dispatchEvent(new Event('input', {  bubbles: true, cancelable: true,}));
						var p = document.querySelector('input[type=password]');
						p.value = "${account.authData.password}";
						p.dispatchEvent(new Event('input', {  bubbles: true, cancelable: true,}));
						setTimeout(function (){document.querySelector('form').submit()}, 100);
					}catch(e){alert(e.message);}
				}
				dosearch();
			`;
			webview.current?.injectJavaScript(auth);
		} else if (url.includes('https://edu.tatar.ru/')) setVisible(true);
		if (url.indexOf('https') === 0) {
			const removeBanner = `try{
			var css = '.banners.row { display: none!important; }',
			head = document.head || document.getElementsByTagName('head')[0],
			style = document.createElement('style'),
			head.appendChild(style);
			style.appendChild(document.createTextNode(css));
		}catch(e){}`;
			webview.current?.injectJavaScript(removeBanner);
		}
	}
}
