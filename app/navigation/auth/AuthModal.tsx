import React, {useEffect} from 'react';
import {StackNavigationProp, createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/core';
import {useAuthFormStore} from '../../features/auth/state/useAuthFormStore';
import {useAuthScreenOptions} from '../../features/auth/hooks/useAuthScreenOptions';
import { Login } from './Login';
import { Password } from './Password';
import { MosPassword } from './MosPassword';
import { SMSAuth } from './SMSAuth';

export type AuthModalStackParamList = {
  Login: undefined;
  Password: undefined;
  SMSAuth: undefined;
  MosPassword: undefined;
};

export type AuthModalNavigationProp = StackNavigationProp<AuthModalStackParamList>;

const Stack = createStackNavigator<AuthModalStackParamList>();

export const AuthModal = () => {
  const navigation = useNavigation();
  const authStore = useAuthFormStore();

  useEffect(() => {
    return navigation.addListener('beforeRemove', () => {
      authStore.clearForm();
    });
  }, [navigation]);

  const defaultScreenOptions = useAuthScreenOptions();

  return (
    <Stack.Navigator
      initialRouteName={'Login'}
      screenOptions={defaultScreenOptions}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Password" component={Password} />
      <Stack.Screen name="SMSAuth" component={SMSAuth} />
      <Stack.Screen name="MosPassword" component={MosPassword} />
    </Stack.Navigator>
  );
};
