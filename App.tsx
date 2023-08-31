import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {FlashMessage} from './app/ui/FlashMessage';
import {QueryClientProvider} from '@tanstack/react-query';
import RootNavigation from './app/navigation/Root';
import {RootStackParamList} from './app/navigation/types';
import {HeadlessBrowserProvider} from './app/features/parsers/HeadlessBrowser/HeadlessBrowser';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { mmkvClientPersister, queryClient } from './app/shared/helpers/persistedQueryClient';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

function App(): JSX.Element {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{persister:mmkvClientPersister}}>
      <HeadlessBrowserProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootNavigation />
            <FlashMessage />
          </NavigationContainer>
        </SafeAreaProvider>
      </HeadlessBrowserProvider>
    </PersistQueryClientProvider>
  );
}

export default App;
