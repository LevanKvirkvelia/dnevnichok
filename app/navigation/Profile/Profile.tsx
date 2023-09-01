import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Students} from './Students';
import {Theme} from './Theme';
import {AdminPage} from './AdminPage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Stack = createStackNavigator();

export function Profile() {
  const {} = useSafeAreaInsets();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Students" component={Students} />
      <Stack.Screen name="Theme" component={Theme} />
      <Stack.Screen name="Test" component={AdminPage} />
    </Stack.Navigator>
  );
}
