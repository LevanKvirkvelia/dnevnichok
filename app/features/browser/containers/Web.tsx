import React, {useRef, useState, useEffect} from 'react';
import {View, Linking, Platform, StyleSheet, Dimensions} from 'react-native';
import WebView from 'react-native-webview';
import Color from 'color';
import {useNavigation} from '@react-navigation/core';
import {MosWebFunctions} from '../helpers/MosWebFunctions';
import {SpbWebFunctions} from '../helpers/SpbWebFunctions';
import {TatarWebFunctions} from '../helpers/TatarWebFunctions';
import {BottomBar} from '../components/BottomBar';
import {LoadingSplash} from '../components/LoadingSplash';
import {ProgressBar} from '../components/ProgressBar';

import {DefaultFunctions} from '../helpers/DefaultFunctions';
import {useActiveAccount, useActiveUser} from '../../auth/hooks/useActiveUser';
import {NavButton} from '../../../ui/NavButton';
import {EngineNames} from '../../parsers/parsers/getParser';

export const webFunctionsMap: Record<EngineNames, typeof MosWebFunctions> = {
  'MOS.RU': MosWebFunctions,
  'Петербургское образование': SpbWebFunctions,
  'edu.tatar.ru': TatarWebFunctions,
};

interface WebProps {
  canDisplay?: boolean;
  startUrl?: string;
  nextUrl?: string;
  injectedJavaScript?: string;
  webFunctions?: (typeof webFunctionsMap)[keyof typeof webFunctionsMap];
  onShouldStartLoadWithRequest?(url: string): boolean;
  showHeaderRightReload: boolean;
}
const {height, width} = Dimensions.get('window');

export function Web({
  canDisplay = true,
  startUrl,
  nextUrl,
  injectedJavaScript,
  webFunctions = DefaultFunctions,
  onShouldStartLoadWithRequest,
  showHeaderRightReload = false,
}: WebProps) {
  const account = useActiveAccount()!;
  const navigation = useNavigation();
  const webview = useRef<WebView>(null);

  const [isVisible, setVisible] = useState(!!startUrl);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uri, setUri] = useState(startUrl || webFunctions.DEFAULT_URL);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const getStartHtml = () => {
    if (Platform.OS !== 'android') return;

    const format = startUrl?.toLowerCase().split('.').pop();

    if (format && ['jpg', 'jpeg', 'png'].includes(format)) {
      return `<style>*{margin:0;}</style><img src="${startUrl}" width="100%" />`;
    }

    if (format && ['doc', 'docx', 'pdf', 'ppt', 'pptx', 'xls', 'xlsx'].includes(format)) {
      return `<style>*{margin:0;}</style><iframe width="100%" height="100%" src="http://docs.google.com/viewer?url=${startUrl}&embedded=true"></iframe>`;
    }
  };

  const startHtml = getStartHtml();
  const [source, setSource] = useState(startHtml ? {html: startHtml} : {uri: startUrl || webFunctions.DEFAULT_URL});

  useEffect(() => {
    if (!showHeaderRightReload || !webview) return;
    function WebHeaderRightButton({tintColor}: {tintColor: string}) {
      return (
        <NavButton
          iconName="refresh"
          size={18}
          color={Color(tintColor)
            .alpha(!webview || isLoading ? 0.5 : 1)
            .rgb()
            .toString()}
          onPress={() => webview?.current?.reload()}
        />
      );
    }
    navigation.setOptions({
      headerRight: (props: any) => <WebHeaderRightButton {...props} />,
    });
  }, [showHeaderRightReload, navigation, webview]);

  if (!webFunctions) return null;

  return (
    <>
      {isVisible ? null : <LoadingSplash />}
      <View
        style={[
          isVisible && canDisplay ? {flex: 1} : {position: 'absolute', height, width, left: -1000 - width},
          {overflow: 'hidden'},
        ]}>
        <View style={{flex: 1}}>
          <ProgressBar progress={progress} loading={isLoading} />
          <WebView
            ref={webview}
            decelerationRate="fast"
            source={source}
            androidLayerType="hardware"
            injectedJavaScript={injectedJavaScript}
            onMessage={() => null} // should be added in order to `injectedJavaScript` prop work
            onNavigationStateChange={event => {
              const {url, canGoBack: newCanGoBack, canGoForward: newCanGoForward, loading} = event;
              navigation.setParams({url, loading});
              webFunctions.onNavigationStateChange?.({
                nextUrl,
                event,
                webview,
                account,
                setVisible,
                setUri,
                startUrl,
              });
              setCanGoBack(newCanGoBack);
              setCanGoForward(newCanGoForward);
              setIsLoading(loading);
              setUri(url);
            }}
            onShouldStartLoadWithRequest={({url}) => {
              if (onShouldStartLoadWithRequest) {
                return onShouldStartLoadWithRequest(url);
              }

              return webFunctions.onShouldStartLoadWithRequest({
                url,
                webview,
                setUrl: nextUri => setSource({uri: nextUri}),
              });
            }}
            onHttpError={({nativeEvent: {url}}) => {
              navigation.goBack();
              Linking.openURL(url);
            }}
            allowsFullscreenVideo
            allowsInlineMediaPlayback
            allowUniversalAccessFromFileURLs
            sharedCookiesEnabled
            userAgent={webFunctions.DEFAULT_USER_AGENT}
            startInLoadingState={!isVisible}
            renderLoading={() => <ProgressBar loading progress={progress} />}
            onLoadProgress={({nativeEvent}) => {
              setProgress(nativeEvent.progress);
            }}
            onLoadEnd={({nativeEvent: event}) => {
              webFunctions.onLoadEnd?.({
                nextUrl,
                event,
                webview,
                account,
                setVisible,
                startUrl,
                setUri,
              });
            }}
          />
        </View>
      </View>
      <BottomBar webview={webview} url={uri} canGoBack={canGoBack} canGoForward={canGoForward} />
    </>
  );
}
