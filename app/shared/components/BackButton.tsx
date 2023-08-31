import React from 'react';
import {Platform} from 'react-native';
import {useNavigation, useNavigationState} from '@react-navigation/core';
import {HeaderBackButton} from '@react-navigation/elements';

export function BackButton() {
  const index = useNavigationState(state => state.index);
  const navigation = useNavigation();
  return index ? (
    <HeaderBackButton
      labelVisible={Platform.OS === 'ios'}
      truncatedLabel="Назад"
      label="Назад"
      tintColor="white"
      onPress={() => navigation.goBack()}
    />
  ) : null;
}
