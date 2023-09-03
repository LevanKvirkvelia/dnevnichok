import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {FlashMessage, showMessage} from './app/ui/FlashMessage';
import RootNavigation from './app/navigation/Root';
import {RootStackParamList} from './app/navigation/types';
import {HeadlessBrowserProvider} from './app/features/parsers/HeadlessBrowser/HeadlessBrowser';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import {mmkvClientPersister} from './app/shared/helpers/mmkvClientPersister';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import {QueryCache, QueryClient, focusManager} from '@tanstack/react-query';
import {AppStateStatus, AppState} from 'react-native';
import BootSplash from 'react-native-bootsplash';
import {CodePushProvider} from './app/features/codePush/components/CodePushWall';
import {Splash} from './app/shared/components/Splash';
import {OTAProgressBar} from './app/features/codePush/components/OTAProgressBar';
import {errorToString} from './app/shared/helpers/errorToString';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

function InitQueryClient() {
  function onAppStateChange(status: AppStateStatus) {
    focusManager.setFocused(status === 'active');
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => subscription.remove();
  }, []);

  return null;
}

const ignoreQueryKeys = ['codePush'];

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError(error, query) {
      const key = typeof query.queryKey?.[0];
      if (typeof key === 'string' && ignoreQueryKeys.some(key => key.startsWith(key))) return;
      showMessage({message: errorToString(error)});
    },
  }),
  defaultOptions: {
    queries: {
      cacheTime: 0,
      staleTime: 0,
      retry: 2,
      retryDelay: 2000,
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    },
  },
});

function App(): JSX.Element {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{persister: mmkvClientPersister}}>
      <InitQueryClient />
      <CodePushProvider
        splash={
          <Splash loveText={'Создано независимыми разработчиками\nиз ❤️ к образованию.'}>
            <OTAProgressBar />
          </Splash>
        }>
        <HeadlessBrowserProvider>
          <NavigationContainer
            onReady={() =>
              requestAnimationFrame(() => {
                BootSplash.hide({fade: true});
              })
            }>
            <ActionSheetProvider>
              <SafeAreaProvider>
                <RootNavigation />
                <FlashMessage />
              </SafeAreaProvider>
            </ActionSheetProvider>
          </NavigationContainer>
        </HeadlessBrowserProvider>
      </CodePushProvider>
    </PersistQueryClientProvider>
  );
}

export default App;
