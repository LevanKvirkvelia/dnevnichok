import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Students} from './Students';
import {Theme} from './Theme';
import {AdminPage} from './AdminPage';

const Stack = createStackNavigator();

export function ProfileTab() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Students" component={Students} />
      <Stack.Screen name="Theme" component={Theme} />
      <Stack.Screen name="Admin" component={AdminPage} />
    </Stack.Navigator>
  );
}
