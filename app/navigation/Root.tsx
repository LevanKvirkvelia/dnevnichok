import React from 'react';
import {Platform} from 'react-native';
import {
  createStackNavigator,
  TransitionPresets,
  CardStyleInterpolators,
} from '@react-navigation/stack';

import Tabs from './Tabs';
import Auth from './auth/Auth';
import {useActiveUser} from '../features/auth/hooks/useActiveUser';

const Stack = createStackNavigator();

function App() {
  const activeUser = useActiveUser();

  return (
    <Stack.Navigator>
      {/* {activeUser && (
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{headerShown: false}}
        />
      )} */}

      <Stack.Screen
        name="Auth"
        component={Auth}
        options={{
          headerShown: false,
          title: 'Авторизация',
          cardStyleInterpolator,
        }}
      />
    </Stack.Navigator>
  );
}

const RootStack = createStackNavigator();

export default function RootNavigation() {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardOverlayEnabled: true,
        cardStyle: {backgroundColor: 'transparent'},
        ...modalAnimationTransition,
      }}>
      <RootStack.Screen name="App" component={App} />
    </RootStack.Navigator>
  );
}

export const modalAnimationTransition =
  Platform.OS === 'ios'
    ? TransitionPresets.ModalPresentationIOS
    : {
        ...TransitionPresets.FadeFromBottomAndroid,
        cardStyleInterpolator: (props: any) => ({
          ...CardStyleInterpolators.forFadeFromBottomAndroid(props),
          overlayStyle: {
            opacity: props.current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
              extrapolate: 'clamp',
            }),
          },
        }),
      };

const cardStyleInterpolator = (props: any) => {
  if (props.index === 0) {
    return CardStyleInterpolators.forNoAnimation();
  }
  return Platform.OS === 'ios'
    ? CardStyleInterpolators.forHorizontalIOS(props)
    : CardStyleInterpolators.forRevealFromBottomAndroid(props);
};
