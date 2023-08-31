import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/core';
import {useAuthFormStore} from '../../features/auth/state/useAuthFormStore';
import {Login} from './Login';
import {Password} from './Password';
import {MosPassword} from './MosPassword';
import {SMSAuth} from './SMSAuth';
import {AuthModalStackParamList} from '../types';
import {useTheme} from '../../features/themes/useTheme';

const Stack = createStackNavigator<AuthModalStackParamList>();

export const AuthModal = () => {
  const navigation = useNavigation();
  const authStore = useAuthFormStore();
  const {colors} = useTheme();

  useEffect(() => {
    return navigation.addListener('beforeRemove', () => {
      authStore.clearForm();
    });
  }, [navigation]);

  return (
    <Stack.Navigator
      initialRouteName={'Login'}
      screenOptions={{
        headerTitle: '',
        headerBackTitle: '',
        headerTitleAlign: 'center',
        headerTitleContainerStyle: {
          paddingHorizontal: Platform.OS === 'ios' ? 10 : 0,
        },
        headerStyle: {
          height: 60,
          backgroundColor: colors.backgroundSecondary,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border,
        },
        cardStyleInterpolator: Platform.OS === 'android' ? CardStyleInterpolators.forVerticalIOS : undefined,
        cardOverlayEnabled: true,
        cardStyle: [
          {backgroundColor: colors.rowBackgroundColor},
          Platform.OS === 'ios' ? {} : {borderTopLeftRadius: 12, borderTopRightRadius: 12},
        ],
      }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Password" component={Password} />
      <Stack.Screen name="SMSAuth" component={SMSAuth} />
      <Stack.Screen name="MosPassword" component={MosPassword} />
    </Stack.Navigator>
  );
};
