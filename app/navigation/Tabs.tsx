import React, {Suspense} from 'react';
import {BottomTabBar, BottomTabBarProps, createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Platform} from 'react-native';
import {DiaryTab} from './diary/DiaryTab';
import {DiaryIcon} from '../icons/DiaryIcon';
import {PeriodsIcon} from '../icons/PeriodsIcon';
import {useTheme} from '../features/themes/useTheme';
import {PeriodsTab} from './periods/PeriodsTab';
import {ProfileTab} from './Profile/ProfileTab';
import {useActiveUser} from '../features/auth/hooks/useActiveUser';
import {Avatar} from '../features/profile/components/Avatar';
import {SessionProvider} from '../features/auth/components/SessionProvider';

import {AIChat} from './ai/AIChat';
import {IonIcon} from '../ui/IonIcon';
import {useAIStore} from '../features/ai/hooks/useUsersStore';
import {AdBanner} from '../features/ads/AdBanner';
import {useCanShowAd} from '../features/ads/useCanShowAd';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const fractions = 1000;
function ProtectedTabs() {
  const {colors} = useTheme();
  const user = useActiveUser();
  const canShowAd = useCanShowAd();
  const {bottom, left, right, top} = useSafeAreaInsets();

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
      }}
      safeAreaInsets={{
        bottom: canShowAd ? 0 : bottom,
        left,
        right,
        top,
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
        key="AITab"
        name="AITab"
        component={AIChat}
        options={{
          tabBarLabel: 'AI',
          tabBarIcon: ({color}) => <IonIcon color={color} name="chatbubbles" size={24} />,
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
  return (
    <SessionProvider>
      <ProtectedTabs />
      <AdBanner />
    </SessionProvider>
  );
}
