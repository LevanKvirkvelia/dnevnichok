import React, {Suspense} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Platform} from 'react-native';
import {DiaryTab} from './diary/DiaryTab';
import {DiaryIcon} from '../icons/DiaryIcon';
import {PeriodsIcon} from '../icons/PeriodsIcon';
import {useTheme} from '../features/themes/useTheme';
import {PeriodsTab} from './periods/PeriodsTab';
import {ProfileTab} from './Profile/ProfileTab';
import {useActiveUser} from '../features/auth/hooks/useActiveUser';
import {Avatar} from '../features/profile/components/Avatar';

const Tab = createBottomTabNavigator();

function ProtectedTabs() {
  const {colors} = useTheme();
  const user = useActiveUser();
  return (
    <Tab.Navigator
      initialRouteName={'DiaryTab'}
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
        header: () => null,
      }}>
      <Tab.Screen
        key="PeriodsTab"
        name="PeriodsTab"
        component={PeriodsTab}
        options={{
          tabBarLabel: 'Оценки',
          tabBarIcon: ({color}) => <PeriodsIcon fill={color} />,
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
        key="ProfileTab"
        name="ProfileTab"
        component={ProfileTab}
        options={{
          tabBarLabel: 'Профиль',
          tabBarIcon: props => <Avatar {...props} user={user} containerStyle={{margin: 0}} size={23} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function Tabs() {
  const user = useActiveUser(false);
  if (!user) return null;
  return <ProtectedTabs />;
}
