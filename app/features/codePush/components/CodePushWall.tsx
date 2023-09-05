import {useState, ReactElement, useEffect} from 'react';
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
  const {setIsLoading, setProgress, deploymentKey = keys[Platform.OS]} = useOTAState();

  const [force, setForce] = useState(false);

  const currentVersionQuery = useOTAVersionQuery();

  useEffect(() => {
    if (currentVersionQuery.data === 'bundle') {
      setForce(true);
    }
  }, [currentVersionQuery.data]);

  const query = useQuery(
    ['codepush', deploymentKey, currentVersionQuery.data],
    async ({queryKey}) => {
      const [_, deploymentKey, currentVersion] = queryKey;

      const forceMode = currentVersion == 'bundle';
      const installMode = forceMode ? codePush.InstallMode.IMMEDIATE : codePush.InstallMode.ON_NEXT_RESUME;

      setForce(forceMode);

      return codePush.sync(
        {installMode, deploymentKey},
        status => {
          if (!forceMode) return;
          requestAnimationFrame(() => {
            BootSplash.hide({fade: true});
          });
          if (status === codePush.SyncStatus.DOWNLOADING_PACKAGE || status === codePush.SyncStatus.INSTALLING_UPDATE) {
            setIsLoading(true);
          }

          if (status === codePush.SyncStatus.UP_TO_DATE) {
            setIsLoading(false);
            setForce(false);
          }
        },
        data => setProgress(data.receivedBytes / data.totalBytes),
      );
    },
    {
      refetchOnWindowFocus: true,
      enabled: !isEmulator && !!currentVersionQuery.data,
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
  if (!currentVersionQuery.data || currentVersionQuery.data === 'bundle') return splash;
  if (force && query.isFetching) return splash;

  return children;
}
