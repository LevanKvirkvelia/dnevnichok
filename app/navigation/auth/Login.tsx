import React from 'react';
import {Keyboard, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useAuthFormStore} from '../../features/auth/state/useAuthFormStore';

import {AuthInput} from '../../features/auth/components/AuthInput';
import {useTheme} from '../../features/themes/useTheme';
import FastImage from 'react-native-fast-image';
import {AvoidingScrollContainer} from '../../shared/components/AvoidingScrollContainer';
import {Button} from '../../ui/Button';
import {useAuthHeader} from '../../features/auth/hooks/useAuthHeader';
import {AuthModalNavigationProp} from '../types';
import {WORKERS} from '../../features/parsers/Workers';

export const Login = () => {
  const {colors} = useTheme();

  const navigation = useNavigation<AuthModalNavigationProp>();

  const {engine, form, setForm} = useAuthFormStore();

  useAuthHeader({
    header: engine,
    subHeader: 'Выбрать другой дневник',
  });

  if (!engine || !WORKERS[engine]) return null;

  const isMOS = engine === 'MOS.RU';

  const submit = () => {
    Keyboard.dismiss();
    if (isMOS) navigation.navigate('MosPassword');
    else navigation.navigate('Password');
  };

  return (
    <AvoidingScrollContainer>
      <View className="items-center px-6">
        <View style={{marginTop: 36}}>
          <FastImage source={WORKERS[engine].logo} style={{height: 85, width: 85}} resizeMode="contain" />
        </View>

        <Text
          style={{
            fontSize: 30,
            fontWeight: '600',
            marginTop: 12,
            textAlign: 'center',
            color: colors.textOnRow,
          }}>
          Вход в дневник
        </Text>
        <View style={{width: '100%', marginTop: 25}}>
          {!isMOS ? (
            <AuthInput
              value={form.login}
              onChange={v => setForm({...form, login: v})}
              placeholder={WORKERS[engine].placeholderLogin}
            />
          ) : null}
          <Button
            disabled={!isMOS && !form.login}
            onPress={submit}
            style={{
              marginTop: 20,
              paddingVertical: 14,
              backgroundColor: WORKERS[engine].buttonColor,
            }}>
            {isMOS ? 'Войти через логин и пароль' : 'Продолжить'}
          </Button>
          {WORKERS[engine]?.SMSAuth ? (
            <Button
              onPress={() => navigation.navigate('SMSAuth')}
              style={{
                marginTop: 10,
                paddingVertical: 14,
                backgroundColor: WORKERS[engine].buttonColor,
              }}>
              Войти через СМС
            </Button>
          ) : null}
          <Text style={{marginTop: 10, color: colors.textOnRow}}>
            Если не знаете логин и пароль — спросите у родителей, они подскажут.
          </Text>
        </View>
      </View>
    </AvoidingScrollContainer>
  );
};
