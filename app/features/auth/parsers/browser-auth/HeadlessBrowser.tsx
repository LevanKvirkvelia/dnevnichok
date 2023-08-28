import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import WebView, {WebViewProps} from 'react-native-webview';
import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import {useWebview, WebviewHandlers} from './useWebview';
import {defaultUserAgent} from './utils';
import {useTheme} from '../../themes/useTheme';
import {ProgressBar} from '../../browser/components/ProgressBar';
import {CloseButton} from '../../../ui/CloseButton';

const HeadlessBrowserContext =
  React.createContext<HeadlessBrowserHandlers | null>(null);

const {width, height} = Dimensions.get('screen');

export type HeadlessBrowserHandlers<T extends boolean = true> =
  WebviewHandlers & {
    close(): void;
    timeout(timeInSeconds: number): Promise<void>;
    goto(url: string | null): Promise<void>;
    setHeadless(headless: T): void;
    setForcedVisibility(setValue: boolean): void;
    onUrlChange(cb: ((url: string) => void) | null): void;
    /**
     * Whether WebView should load next urls or not
     * @default enabled
     * */
    setRequestsEnabled(redirects: boolean): void;
    /** Overrides `setRequestsEnabled` */
    onRequest(cb: ((url: string) => boolean) | null): void;
    onClose(cb: (() => void) | null): void;
    /**
     * Enables cache in order to get cookie using @react-native-community/cookies
     * @default disabled
     * */
    setCacheEnabled(cache: boolean): void;
    onError(cb: ((error: Error) => void) | null): void;
  } & (T extends false ? {webview: React.ReactNode} : unknown);

export type HeadlessBrowserParams<T extends boolean = true> = {
  headless?: T;
};

export function useHeadlessBrowser<T extends boolean>({
  headless = true as T,
}: HeadlessBrowserParams<T> = {}) {
  const ctx = useContext(
    HeadlessBrowserContext,
  ) as HeadlessBrowserHandlers<T> | null;

  if (ctx == null) {
    throw new Error('useHeadless must be used within HeadlessProvider');
  }

  const {close, setHeadless} = ctx;

  useEffect(() => setHeadless(headless), [headless, setHeadless]);
  useEffect(() => close, [close]);

  return ctx;
}

export function HeadlessBrowserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {colors} = useTheme();
  const [uri, setUri] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [inProgress, setInProgress] = useState(false);
  const [cacheEnabled, setCacheEnabled] = useState(true);
  const [requestsEnabled, setRequestsEnabled] = useState(true);
  const [forceVisibility, setForceVisibility] = useState(!false);
  const [onUrlChangeCb, setOnUrlChangeCb] = useState<
    ((url: string) => void) | null
  >(null);
  const [onRequestCb, setOnRequestCb] = useState<
    ((url: string) => boolean) | null
  >(null);
  const [onErrorCb, setOnErrorCb] = useState<((error: Error) => void) | null>(
    null,
  );
  const [headless, setHeadless] = useState<boolean | null>(true);
  const [resolvers] = useState(() => new Map<string, (v: void) => void>());
  const [rejecters] = useState(() => new Map<string, () => void>());
  const onCloseCbRef = useRef<(() => void) | null>();

  const [webviewProps, webviewHandlers] = useWebview();

  const handleLoadEnd: WebViewProps['onLoadEnd'] = event => {
    if (webviewProps.onLoadEnd) {
      webviewProps.onLoadEnd(event);
    }

    const resolver = uri && resolvers.get(uri);

    if (resolver) {
      resolver();
    }
  };

  // reject `goto` if uri was closed before load
  useEffect(() => {
    const rejecter = uri && rejecters.get(uri);

    if (!rejecter) return;

    return rejecter;
  }, [rejecters, uri]);

  const goto: HeadlessBrowserHandlers['goto'] = useCallback(
    nextUrl => {
      setUri(nextUrl);

      if (!nextUrl) return Promise.resolve();

      return new Promise((resolve, reject) => {
        resolvers.set(nextUrl, resolve);
        rejecters.set(nextUrl, reject);
      });
    },
    [rejecters, resolvers],
  );
  const timeout: HeadlessBrowserHandlers['timeout'] = useCallback(
    time => new Promise(resolve => setTimeout(resolve, time)),
    [],
  );

  const onClose: HeadlessBrowserHandlers['onClose'] = useCallback(
    cb => (onCloseCbRef.current = cb),
    [],
  );
  const onRequest: HeadlessBrowserHandlers['onRequest'] = useCallback(
    cb => setOnRequestCb(() => cb),
    [],
  );
  const onError: HeadlessBrowserHandlers['onError'] = useCallback(
    cb => setOnErrorCb(() => cb),
    [],
  );
  const onUrlChange: HeadlessBrowserHandlers['onUrlChange'] = useCallback(
    cb => setOnUrlChangeCb(() => cb),
    [],
  );
  const setForcedVisibility: HeadlessBrowserHandlers['setForcedVisibility'] =
    useCallback((v: boolean) => setForceVisibility(v), []);

  const close: HeadlessBrowserHandlers['close'] = useCallback(() => {
    goto(null);
    onRequest(null);
    onCloseCbRef.current?.();
    onClose(null);
    onError(null);
    onUrlChange(null);
    setRequestsEnabled(true);
    setForceVisibility(false);
    setCacheEnabled(false);
  }, [goto, onCloseCbRef, onRequest, onClose, onError, onUrlChange]);

  const webview = uri ? (
    <View style={{flex: 1}}>
      <ProgressBar
        color={colors.primary}
        backgroundColor="white"
        loading={inProgress}
        progress={progress}
      />
      <WebView
        key={uri}
        decelerationRate="fast"
        source={{uri}}
        sharedCookiesEnabled
        androidLayerType="hardware"
        cacheEnabled={cacheEnabled}
        onNavigationStateChange={({url, loading}) => {
          if (onUrlChangeCb) onUrlChangeCb(url);
          setInProgress(loading);
        }}
        onShouldStartLoadWithRequest={({url}) =>
          onRequestCb ? onRequestCb(url) : requestsEnabled
        }
        onLoadProgress={({nativeEvent}) => setProgress(nativeEvent.progress)}
        onHttpError={({nativeEvent}) =>
          onErrorCb
            ? onErrorCb(
                new Error(
                  `HTTP error ${nativeEvent.statusCode}. ${nativeEvent.url}`,
                ),
              )
            : null
        }
        userAgent={defaultUserAgent}
        {...webviewProps}
        onLoadEnd={handleLoadEnd}
      />
    </View>
  ) : null;

  const context: HeadlessBrowserHandlers = {
    ...webviewHandlers,
    goto,
    timeout,
    close,
    onClose,
    setHeadless,
    setCacheEnabled,
    setRequestsEnabled,
    onUrlChange,
    onRequest,
    setForcedVisibility,
    onError,
    ...(headless === false && {webview}),
  };

  return (
    <HeadlessBrowserContext.Provider value={context}>
      {children}
      {headless && webview ? (
        <View
          style={{
            position: 'absolute',
            width,
            height,
            left: forceVisibility ? 0 : -10000 - width,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: 'hidden',
          }}>
          <View style={{height: 60}} />
          <CloseButton position="absolute" top={70} onPress={() => close()} />
          {webview}
        </View>
      ) : null}
    </HeadlessBrowserContext.Provider>
  );
}
