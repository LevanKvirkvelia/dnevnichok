import { MosWebFunctions } from './MosWebFunctions';
import { WebFunctionsParams } from '../types';

export class SpbWebFunctions extends MosWebFunctions {
	static DEFAULT_URL = `https://dnevnik2.petersburgedu.ru/login`;

	static onNavigationStateChange({ event, setVisible }: WebFunctionsParams) {
		const { url } = event;
		try {
			if (url.includes('/student/my')) setVisible(true);
		} catch (e) {
			console.error('SpbWebFunctions.onNavigationStateChange', e);
		}
	}

	static onLoadEnd({ event, account, webview }: WebFunctionsParams) {
		const { url } = event;
		if (url?.includes('/login')) {
			const auth = `
				function dosearch(){
					try{
						var e = document.querySelector('input[type=email]');
						if(!e) return setTimeout(function(){dosearch();}, 100);
						e.value = "${account.authData.login}";
						e.dispatchEvent(new Event('input', {  bubbles: true, cancelable: true,}));
						var p = document.querySelector('input[type=password]');
						p.value = "${account.authData.password}";
						p.dispatchEvent(new Event('input', {  bubbles: true, cancelable: true,}));
						setTimeout(function (){document.querySelector('button[type=submit]').click()}, 100);
					}catch(e){alert(e.message);}
				}
				dosearch();
			`;
			webview.current?.injectJavaScript(auth);
		}
	}
}
