import React, {useEffect} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';

import {useNavigation} from '@react-navigation/core';
import {useAuthHeader} from '../../features/auth/hooks/useAuthHeader';
import {useTheme} from '../../features/themes/useTheme';
import {useAuthFormStore} from '../../features/auth/state/useAuthFormStore';
import {AvoidingScrollContainer} from '../../components/AvoidingScrollContainer';
import FastImage from 'react-native-fast-image';
import {AuthInput} from '../../features/auth/components/AuthInput';
import {Button} from '../../ui/Button';
import {PrivacyMessage} from '../../features/auth/components/PrivacyMessage';
import {Link} from '../../ui/Link';
import {openLink} from '../../helpers/openLink';
import {useMutation} from 'react-query';
import {doLogin} from '../../features/auth/hooks/useDoLogin';
import {errorToString} from '../../helpers/errorToString';
import { WORKERS } from '../../features/auth/parsers/Workers';

export const Password = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();

  const {engine, form, setForm, error} = useAuthFormStore();
  useAuthHeader({
    header: 'Введите пароль',
    onBack: () => {
      setForm({password: ''});
    },
  });

  const getRecoveryURL = () =>
    engine === 'MOS.RU'
      ? `${WORKERS[engine].recoveryLink}?login=${encodeURIComponent(
          form.login,
        )}`
      : WORKERS[engine].recoveryLink;

  const loginMutation = useMutation(
    () => {
      return doLogin({
        authData: form,
        engine,
        isAuth: true,
      });
    },
    {
      onError(error) {
        if (errorToString(error)?.includes('Ваш пароль устарел')) {
          openLink(getRecoveryURL()!);
        }
      },
    },
  );

  if (!engine || !WORKERS[engine]) return null;

  return (
    <AvoidingScrollContainer>
      <View className="items-center px-6">
        <View style={{marginTop: 36}}>
          <FastImage
            source={WORKERS[engine].logo}
            style={{height: 85, width: 85}}
            resizeMode="contain"
          />
        </View>
        <Text
          style={{
            fontSize: 30,
            fontWeight: '600',
            marginTop: 16,
            color: colors.textOnRow,
          }}>
          {form.login}
        </Text>
        <Text className="text-red-500" style={{marginTop: 5}} numberOfLines={3}>
          {error}
        </Text>
        <View style={{width: '100%', marginTop: 20}}>
          <AuthInput
            value={form.password}
            onChange={v => setForm({password: v})}
            onSubmit={() => loginMutation.mutate()}
            placeholder="Пароль"
            isPassword
            indicator={
              loginMutation.isLoading ? (
                <ActivityIndicator color={colors.textOnRow} />
              ) : WORKERS[engine].recoveryLink ? (
                <Link href={getRecoveryURL()}>Я не знаю пароль</Link>
              ) : null
            }
          />
          <Button
            disabled={!form.password}
            onPress={() => loginMutation.mutate()}
            style={{
              marginTop: 20,
              paddingVertical: 14,
              backgroundColor: WORKERS[engine].buttonColor,
            }}>
            Войти в дневник
          </Button>
          <View style={{marginTop: 10}}>
            <PrivacyMessage />
          </View>
        </View>
      </View>
    </AvoidingScrollContainer>
  );
};
