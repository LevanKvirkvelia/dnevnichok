/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {View} from 'react-native';
import {FlashMessage} from './app/ui/FlashMessage';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {HeadlessBrowserProvider} from './app/features/auth/parsers/browser-auth/HeadlessBrowser';
import RootNavigation from './app/navigation/Root';

const queryClient = new QueryClient({});

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <HeadlessBrowserProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <View>
              <RootNavigation />
              <FlashMessage />
            </View>
          </NavigationContainer>
        </SafeAreaProvider>
      </HeadlessBrowserProvider>
    </QueryClientProvider>
  );
}

export default App;
