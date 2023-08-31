import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Platform} from 'react-native';
import {DiaryTab} from './diary/DiaryTab';
import {DiaryIcon} from '../icons/DiaryIcon';
import {PeriodsIcon} from '../icons/PeriodsIcon';
import {useTheme} from '../features/themes/useTheme';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  const {colors} = useTheme();

  return (
    <Tab.Navigator
      initialRouteName={'DiaryTab'}
      //   safeAreaInsets={{}} TODO ADS
      screenOptions={{
        tabBarActiveTintColor: colors.activeTab,
        tabBarInactiveTintColor: colors.inactiveTab,
        tabBarLabelStyle: {
          fontWeight: '500',
          marginTop: -4,
          marginBottom: 4,
          margin: 0,
        },

        tabBarStyle: [
          {
            backgroundColor: colors.tabsBackground,
            borderTopColor: colors.border,
          },
          Platform.OS === 'ios' ? {} : {padding: 0, margin: 0},
        ],
      }}>
      <Tab.Screen
        key="PeriodsTab"
        name="PeriodsTab"
        component={PeriodsTab}
        options={{
          tabBarLabel: 'Оценки',
          tabBarIcon: props => <PeriodsIcon {...props} />,
        }}
      />
      <Tab.Screen
        key="DiaryTab"
        name="DiaryTab"
        component={DiaryTab}
        options={{
          tabBarLabel: 'Дневник',
          tabBarIcon: ({color}) => <DiaryIcon fill={color} />,
        }}
      />
      <Tab.Screen
        key="Profile"
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Профиль',
          tabBarIcon: props => <UserAvatar {...props} containerStyle={{margin: 0}} size={23} />,
        }}
      />
    </Tab.Navigator>
  );
}
