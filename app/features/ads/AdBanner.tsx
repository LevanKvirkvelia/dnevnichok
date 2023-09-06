import React, {useMemo} from 'react';
import {Dimensions, View} from 'react-native';

import {BannerView} from 'react-native-yandex-mobile-ads';
import {useCanShowAd} from './useCanShowAd';
import {useInterstitialAd} from './useInterstitialAd';
import {useTheme} from '../themes/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const {width} = Dimensions.get('window');

export function AdBanner() {
  const {colors} = useTheme();

  const canShowAd = useCanShowAd();
  useInterstitialAd();

  const {bottom} = useSafeAreaInsets();

  if (!canShowAd) return null;

  return (
    <View>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.tabsBackground,
        }}>
        <BannerView
          style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
          adUnitId="R-M-747596-2"
          size="BANNER_320x50"
          onLoad={() => console.log('onLoad')}
          onLeftApplication={() => console.log('onLeftApplication')}
          onReturnedToApplication={() => console.log('onReturnedToApplication')}
          onError={(err: any) => console.log('error', err)}
        />
      </View>
      {bottom ? (
        <View
          style={{
            height: bottom,
            width,
            backgroundColor: colors.tabsBackground,
          }}
        />
      ) : null}
    </View>
  );
}
