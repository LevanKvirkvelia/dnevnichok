import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Periods} from './Periods';
import {SubjectInfoPage} from './SubjectInfo';
import {PeriodsSettings} from './PeriodsSettings';
import {PeriodsTabParamList} from '../types';

const Stack = createStackNavigator<PeriodsTabParamList>();

export function PeriodsTab() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Periods" component={Periods} />
      <Stack.Screen name="SubjectInfo" component={SubjectInfoPage} />
      <Stack.Screen name="PeriodsSettings" component={PeriodsSettings} />
    </Stack.Navigator>
  );
}
