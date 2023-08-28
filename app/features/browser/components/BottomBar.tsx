import React, {RefObject} from 'react';
import WebView from 'react-native-webview';
import {View, Share, Platform, SafeAreaView, Linking} from 'react-native';
import {useTheme} from '../../themes/useTheme';
import {NavButton} from '../../../ui/NavButton';

const DEFAULT_TABBAR_HEIGHT = 50;

interface BottomBarProps {
  url: string;
  webview: RefObject<WebView>;
  canGoBack?: boolean;
  canGoForward?: boolean;
}

export function BottomBar({
  webview,
  canGoBack,
  canGoForward,
  url,
}: BottomBarProps) {
  const {colors} = useTheme();

  return (
    <SafeAreaView style={{backgroundColor: colors.tabsBackground}}>
      <View
        style={{
          height: DEFAULT_TABBAR_HEIGHT,
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <NavButton
          iconName="chevron-back"
          size={18}
          color={canGoBack ? colors.activeTab : colors.inactiveTab}
          onPress={() => webview.current?.goBack()}
        />
        <NavButton
          iconName="chevron-forward"
          size={18}
          color={canGoForward ? colors.activeTab : colors.inactiveTab}
          onPress={() => webview.current?.goForward()}
        />
        <NavButton
          iconName="share"
          size={18}
          color={colors.activeTab}
          onPress={() => {
            Share.share(Platform.OS === 'ios' ? {url} : {message: url});
          }}
        />
        <NavButton
          iconName="compass"
          size={18}
          color={colors.activeTab}
          onPress={() => Linking.openURL(url)}
        />
      </View>
    </SafeAreaView>
  );
}
