import {ReactElement, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import codePush from 'react-native-code-push';
import {isEmulatorSync} from 'react-native-device-info';
import {useOTAState} from '../state/useOTAState';
import {useQuery} from '@tanstack/react-query';
import BootSplash from 'react-native-bootsplash';
import {useOTAVersionQuery} from '../hooks/useOTAVersion';

const keys: Partial<Record<typeof Platform.OS, string>> = {
  ios: 'w9O9B7GQpha__YynDaVma9W7pky98f2b4b6f-3714-43b5-918e-fe59aadba369',
  android: 'iclAkZe9uY22qk3Ose0XH1Mn2Hxf8f2b4b6f-3714-43b5-918e-fe59aadba369',
};

const isEmulator = isEmulatorSync();

export function CodePushProvider({splash, children}: {splash: ReactElement; children: ReactElement}) {
  const {deploymentKey = keys[Platform.OS]} = useOTAState();

  const currentVersionQuery = useOTAVersionQuery();

  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsTimedOut(true), 1000 * 45);
  }, []);

  const query = useQuery(
    ['codepush', deploymentKey, currentVersionQuery.data],
    async ({queryKey}) => {
      const [_, deploymentKey, currentVersion] = queryKey;

      const forceMode = currentVersion == 'bundle';
      const installMode = forceMode ? codePush.InstallMode.IMMEDIATE : codePush.InstallMode.ON_NEXT_RESUME;

      return codePush.sync(
        {installMode, deploymentKey},
        status => {
          if (!forceMode) return;
          requestAnimationFrame(() => {
            BootSplash.hide({fade: true});
          });
          if (status === codePush.SyncStatus.DOWNLOADING_PACKAGE || status === codePush.SyncStatus.INSTALLING_UPDATE) {
            useOTAState.getState().setIsLoading(true);
          }

          if (status === codePush.SyncStatus.UP_TO_DATE) {
            useOTAState.getState().setIsLoading(false);
          }
        },
        data => useOTAState.getState().setProgress(data.receivedBytes / data.totalBytes),
      );
    },
    {
      refetchOnWindowFocus: true,
      enabled: !isEmulator && !__DEV__ && !!currentVersionQuery.data,
      retry: true,
      retryDelay: 1000 * 200,
    },
  );

  useEffect(() => {
    if (query.isError) {
      BootSplash.hide({fade: true});
    }
  }, [query.isError]);

  if (isEmulator || __DEV__) return children;
  if ((!currentVersionQuery.data || currentVersionQuery.data === 'bundle') && !query.isError && !isTimedOut)
    return splash;

  return children;
}
