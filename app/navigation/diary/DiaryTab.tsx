import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Diary} from './Diary';
import {LessonInfo} from './LessonInfo';
import {InAppBrowser} from './InAppBrowser';

const Stack = createStackNavigator();

export function DiaryTab() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Diary" component={Diary} />
      <Stack.Screen name="LessonInfo" component={LessonInfo} />
      <Stack.Screen name="InAppBrowser" component={InAppBrowser} />
    </Stack.Navigator>
  );
}
