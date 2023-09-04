import React, {useEffect} from 'react';
import {AppStateStatus, AppState} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import {QueryClient, QueryClientProvider, focusManager} from '@tanstack/react-query';
import BootSplash from 'react-native-bootsplash';
import {FlashMessage} from './app/ui/FlashMessage';
import RootNavigation from './app/navigation/Root';
import {RootStackParamList} from './app/navigation/types';
import {HeadlessBrowserProvider} from './app/features/parsers/HeadlessBrowser/HeadlessBrowser';
import {CodePushProvider} from './app/features/codePush/components/CodePushWall';
import {Splash} from './app/shared/components/Splash';
import {OTAProgressBar} from './app/features/codePush/components/OTAProgressBar';
import {SessionProvider} from './app/features/auth/components/SessionProvider';

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

const queryClient = new QueryClient();

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <InitQueryClient />
      <SessionProvider>
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
      </SessionProvider>
    </QueryClientProvider>
  );
}

export default App;
