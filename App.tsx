import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {FlashMessage} from './app/ui/FlashMessage';
import {QueryClientProvider} from '@tanstack/react-query';
import RootNavigation from './app/navigation/Root';
import {RootStackParamList} from './app/navigation/types';
import {HeadlessBrowserProvider} from './app/features/parsers/HeadlessBrowser/HeadlessBrowser';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import {mmkvClientPersister, queryClient} from './app/shared/helpers/persistedQueryClient';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

function App(): JSX.Element {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{persister: mmkvClientPersister}}>
      <HeadlessBrowserProvider>
        <NavigationContainer>
          <ActionSheetProvider>
            <SafeAreaProvider>
              <RootNavigation />
              <FlashMessage />
            </SafeAreaProvider>
          </ActionSheetProvider>
        </NavigationContainer>
      </HeadlessBrowserProvider>
    </PersistQueryClientProvider>
  );
}

export default App;
