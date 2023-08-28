/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {Splash} from './app/features/Splash';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {View} from 'react-native';
import {FlashMessage} from './app/ui/FlashMessage';
import {QueryClient, QueryClientProvider} from 'react-query';
import {HeadlessBrowserProvider} from './app/features/auth/parsers/browser-auth/HeadlessBrowser';

const queryClient = new QueryClient();

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <HeadlessBrowserProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <View>
              <Splash />
              <FlashMessage />
            </View>
          </NavigationContainer>
        </SafeAreaProvider>
      </HeadlessBrowserProvider>
    </QueryClientProvider>
  );
}

export default App;
