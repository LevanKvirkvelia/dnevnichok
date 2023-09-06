import {useCallback, useEffect, useState} from 'react';
import {InterstitialAdManager} from 'react-native-yandex-mobile-ads';
import {useCanShowAd} from './useCanShowAd';
import {useAdsStore} from './useAdsStore';
import {useAppState} from '../../shared/hooks/useAppState';

const MIN_PAUSE_BETWEEN_AD = 2 * 60 * 1000; // 2 minutes
const SHOW_NEXT_AD_AFTER = 3 * 60 * 1000; // 3 minutes

export function useInterstitialAd() {
  const [sessionLastAd, setSessionLastAd] = useState<number>(0);

  const {lastAd, updateLastAd} = useAdsStore();
  const canShowAd = useCanShowAd();

  const showAd = useCallback(() => {
    const canShowByGlobalRule = lastAd < Date.now() - MIN_PAUSE_BETWEEN_AD;
    const canShowBySessionRule = sessionLastAd < Date.now() - SHOW_NEXT_AD_AFTER;

    if (canShowAd && canShowByGlobalRule && canShowBySessionRule)
      InterstitialAdManager.showAd('R-M-747596-1').then(() => {
        updateLastAd();
        setSessionLastAd(Date.now());
      });
  }, [canShowAd, sessionLastAd, lastAd, updateLastAd]);

  useEffect(() => {
    const interval = setInterval(() => showAd(), 9000);
    return () => clearInterval(interval);
  }, [showAd]);

  useAppState(() => setSessionLastAd(0), ['open', 'start']);
}

