import React from 'react';
import {Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useIDFA} from '../../features/ads/useIDFA';
import {useTheme} from '../../features/themes/useTheme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {HeaderBackButton} from '@react-navigation/elements';
import {openLink} from '../../helpers/openLink';
import {EngineList} from '../../features/auth/components/EngineList';
import {AuthNavigationProp} from './Auth';

export const EngineSelect = () => {
  const {colors} = useTheme();
  const {top} = useSafeAreaInsets();

  useIDFA(true);
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.primary,
      }}>
      <ScrollView
        contentContainerStyle={[
          {flex: 1},
          Platform.OS === 'web' ? {alignItems: 'center'} : {},
        ]}>
        <View style={{alignSelf: 'flex-start', marginTop: top + 15}}>
          {navigation.canGoBack() ? (
            <HeaderBackButton
              labelVisible={Platform.OS === 'ios'}
              truncatedLabel="Назад"
              label="Назад"
              tintColor="white"
              onPress={() => navigation.goBack()}
            />
          ) : null}
        </View>
        <View style={{padding: 20, flexGrow: 2, justifyContent: 'center'}}>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold', color: 'white', fontSize: 30}}>
              Выберите дневник
            </Text>
            <Text
              style={{
                color: 'rgba(255, 255, 255, 0.75)',
                fontSize: 16,
                lineHeight: 19,
                marginTop: 5,
              }}>
              Которым вы пользуетесь
            </Text>
          </View>
          <View
            style={{
              marginTop: 20,
              backgroundColor: colors.rowBackgroundColor,
              borderRadius: 12,
            }}>
            <EngineList onNavigate={() => navigation.navigate('AuthModal')} />
          </View>
        </View>
        <View style={{flexGrow: 1}} />
        <View style={{alignItems: 'center', marginBottom: 14}}>
          <TouchableOpacity
            onPress={() => {
              openLink(
                `https://docs.google.com/forms/d/e/1FAIpQLSeiFZ_nLqp_iZJXpGCwtuf4HBqLacc8pjwkb6NAI-ezNrJDcA/viewform`,
              );
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                lineHeight: 19,
                marginTop: 5,
                paddingBottom: 20,
              }}>
              Моего дневника здесь нет
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
