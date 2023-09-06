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
import {SessionProvider} from '../features/auth/components/SessionProvider';
import {NavigatorIcon} from '../icons/NavigatorIcon';
import {AIChat} from './ai/AIChat';
import {IonIcon} from '../ui/IonIcon';
import {useAIStore} from '../features/ai/hooks/useUsersStore';

const Tab = createBottomTabNavigator();

const fractions = 1000;
function ProtectedTabs() {
  const {colors} = useTheme();
  const user = useActiveUser();
  const {temporaryId, isForcedAB} = useAIStore();
  const groupId = parseInt(temporaryId, 36) % fractions;

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

      {(groupId < fractions * 0.1 || isForcedAB) && (
        <Tab.Screen
          key="AITab"
          name="AITab"
          component={AIChat}
          options={{
            tabBarLabel: 'AI',
            tabBarIcon: ({color}) => <IonIcon color={color} name="chatbubbles" size={24} />,
          }}
        />
      )}
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
    </SessionProvider>
  );
}
