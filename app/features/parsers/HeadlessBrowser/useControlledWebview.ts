import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import WebView, {WebViewProps} from 'react-native-webview';
import {
  functionCallToString,
  sendMessageFn,
  waitForSelectorWebview,
  waitForTextWebview,
} from './utils';

let executeId = 0;
let subscribeId = 0;

export interface WebviewHandlers {
  /**
   * It is possible to pass the function, that returns Promise, BUT not async/await
   * */
  evaluate<R = any>(fn: string, ...args: any[]): Promise<R>;
  subscribe<S>(
    event: string,
    listener: (data: S) => void,
    onEvent: string,
    selector?: string,
  ): void;
  waitForTimeout(ms: number): void;
  waitForSelector(selector: string, ignoreHidden?: boolean): Promise<boolean>;
  waitForText(text: string, ignoreHidden?: boolean): Promise<boolean>;
}

export interface WebviewMessage {
  key: string;
  data: unknown;
}

export type WebviewProps = Partial<WebViewProps> & {
  ref: (instance: WebView) => void;
};

export function useControlledWebview(): [WebviewProps, WebviewHandlers] {
  const [resolvers] = useState(() => {
    return new Map<
      string,
      {resolve: (data?: unknown) => void; retry: () => void; persist?: boolean}
    >();
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [initialize, setInitialize] = useState<null | (() => void)>(null);
  const [initialized] = useState(
    () => new Promise(resolve => setInitialize(() => resolve)),
  );
  const webview = useRef<WebView | null>(null);
  const setWebview = useCallback(
    (instance: WebView) => {
      webview.current = instance;
      if (initialize) initialize();
    },
    [initialize],
  );

  useEffect(() => {
    if (isLoaded) {
      resolvers.forEach(resolver => resolver.retry());
    }
  }, [isLoaded, resolvers]);

  const processMessage: WebViewProps['onMessage'] = event => {
    try {
      const message: WebviewMessage = JSON.parse(event.nativeEvent.data);

      if (!message || typeof message !== 'object') return;

      const {key, data} = message;

      if (key === 'error') {
        throw new Error(String(data));
      }

      const resolver = resolvers.get(key);

      if (!resolver) return;

      resolver.resolve(data);

      if (!resolver.persist) {
        resolvers.delete(key);
      }
    } catch (e) {
      console.error('Webview processMessage', e);
    }
  };

  const injectCode = useCallback(
    async (code: string) => {
      await initialized;

      const injectedCode = `
				(function() {
					try {
						${code};
					} catch (e) {
						const error = JSON.stringify({ key: 'error', data: e.toString() });
						${sendMessageFn}(() => error);
					}
				})();
				true;
			`;

      if (webview.current) {
        return webview.current.injectJavaScript(injectedCode);
      }

      throw new Error(`Webview hasn't been initialized`);
    },
    [initialized],
  );

  const evaluate: WebviewHandlers['evaluate'] = useCallback(
    async (fn, ...args) => {
      const key = `execute${executeId++}`;

      const retry = () =>
        injectCode(`
					Promise.resolve(${functionCallToString(fn, ...args)}).then(data => {
						const message = JSON.stringify({ key: "${key}", data });

						${sendMessageFn}(() => message);
					});
				`);

      const promise = new Promise<any>(resolve => {
        resolvers.set(key, {resolve: resolve as (v: unknown) => void, retry});
      });

      await retry();

      return promise;
    },
    [injectCode, resolvers],
  );

  const addEventListener = useCallback(
    function addEventListenerFn<E, D>(
      key: string,
      event: string,
      onEvent: string,
      selector?: string,
    ) {
      const findElement = `function (selectorArg){return (selectorArg ? document.querySelector(selectorArg) : window)}`;

      return injectCode(`
				const element = ${functionCallToString(findElement, selector)};

				if (!element) return;

				element.addEventListener('${event}', event => {
					const onEvent = ${onEvent};
					const message = JSON.stringify({ key: "${key}", data: onEvent(event) });

					${sendMessageFn}(() => message);
				})
			`);
    },
    [injectCode],
  );

  const subscribe: WebviewHandlers['subscribe'] = useCallback(
    (event, listener, onEvent, selector) => {
      const key = `subscribe${subscribeId++}`;

      const retry = () => addEventListener(key, event, onEvent, selector);
      resolvers.set(key, {
        resolve: listener as (data: unknown) => void,
        retry,
        persist: true,
      });

      retry();
    },
    [addEventListener, resolvers],
  );

  const waitForSelector: WebviewHandlers['waitForSelector'] = useCallback(
    (selector, ignoreHidden) => {
      return evaluate(waitForSelectorWebview, selector, ignoreHidden);
    },
    [evaluate],
  );

  const waitForText: WebviewHandlers['waitForText'] = useCallback(
    (text, ignoreHidden) => {
      return evaluate(waitForTextWebview, text, ignoreHidden);
    },
    [evaluate],
  );

  const waitForTimeout: WebviewHandlers['waitForTimeout'] = useCallback(ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }, []);

  const handlers: WebviewHandlers = useMemo(
    () => ({subscribe, waitForSelector, evaluate, waitForTimeout, waitForText}),
    [subscribe, waitForSelector, waitForText, evaluate, waitForTimeout],
  );

  return [
    {
      ref: setWebview,
      onMessage: processMessage,
      onLoadEnd: () => setIsLoaded(true),
      onLoadStart: () => setIsLoaded(false),
    },
    handlers,
  ];
}
