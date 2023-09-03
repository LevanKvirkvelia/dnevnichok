import React, {useCallback} from 'react';
import * as Url from 'url';
import {useNavigation, useRoute} from '@react-navigation/core';
import {useActiveUser} from '../../features/auth/hooks/useActiveUser';
import {Web, webFunctionsMap} from '../../features/browser/containers/Web';
import {BackButton} from '../../shared/components/BackButton';
import {useDiaryNavOptions} from '../../shared/hooks/useDiaryNavOptions';
import {DiaryTabScreenProps} from '../types';

export function useInAppBrowser() {
  const {navigate} = useNavigation();
  const openBrowser = useCallback(
    (params?: {displayUrl?: string; startUrl?: string; nextUrl?: string; title?: string}) => {
      navigate('Tabs', {
        screen: 'DiaryTab',
        params: {screen: 'InAppBrowser', params},
      });
    },
    [navigate],
  );
  return openBrowser;
}

export function InAppBrowser() {
  const {params} = useRoute<DiaryTabScreenProps<'InAppBrowser'>['route']>();
  const user = useActiveUser();

  const {displayUrl, startUrl, nextUrl, title} = params || {};

  const domain = displayUrl || startUrl ? Url.parse(displayUrl || startUrl || '').hostname : '';

  useDiaryNavOptions({
    title: title || domain || '',
    headerTitleStyle: {textAlign: 'center'},
    headerLeft: () => <BackButton />,
  });

  const functions = webFunctionsMap[user?.engine];

  return <Web showHeaderRightReload nextUrl={nextUrl} webFunctions={functions} startUrl={startUrl} />;
}
