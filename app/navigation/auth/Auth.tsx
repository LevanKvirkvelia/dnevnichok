import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import {
  createStackNavigator,
  StackNavigationProp,
  TransitionPresets,
} from '@react-navigation/stack';
import {EngineSelect} from './EngineSelect';
import { AuthModal } from './AuthModal';

const Stack = createStackNavigator();

type AuthStackParamList = {
  EngineSelect: undefined;
  AuthModal: undefined;
};



export type AuthNavigationProp = StackNavigationProp<AuthStackParamList>;

export default function Auth() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardOverlayEnabled: true,
        cardStyle: {
          backgroundColor:
            Platform.OS === 'web' ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
        },
        ...(Platform.OS === 'ios'
          ? TransitionPresets.ModalPresentationIOS
          : TransitionPresets.RevealFromBottomAndroid),
      }}>
      <Stack.Screen
        name="EngineSelect"
        component={EngineSelect}
        options={{title: 'Выберите дневник'}}
      />
      <Stack.Screen name="AuthModal" component={AuthModal} />
    </Stack.Navigator>
  );
}
