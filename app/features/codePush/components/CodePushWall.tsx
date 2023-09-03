import {useState, ReactElement} from 'react';
import {Platform} from 'react-native';
import codePush from 'react-native-code-push';
import {isEmulatorSync} from 'react-native-device-info';
import {useOTAState} from '../state/useOTAState';
import {useQuery} from '@tanstack/react-query';
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

  const query = useQuery(
    ['codepush', deploymentKey, currentVersionQuery.data],
    async ({queryKey}) => {
      console.log('fetch this shit');
      const [_, deploymentKey, currentVersion] = queryKey;

      const check = await codePush.checkForUpdate(deploymentKey);
      const forceMode = !currentVersion || check?.description?.includes('force') || false;
      const installMode = forceMode ? codePush.InstallMode.IMMEDIATE : codePush.InstallMode.ON_NEXT_RESUME;

      setForce(forceMode);

      return codePush.sync(
        {installMode, deploymentKey},
        status => {
          if (!forceMode) return;

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
      refetchOnWindowFocus: false,
      enabled: !isEmulator && !!currentVersionQuery.data,
      retry: false,
      retryDelay: 30000,
      staleTime: 1000 * 60 * 10,
    },
  );

  return force && query.isFetching && !isEmulator ? splash : children;
}
