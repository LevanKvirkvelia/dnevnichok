import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {useTheme} from '../../features/themes/useTheme';
import {useAuthHeader} from '../../features/auth/hooks/useAuthHeader';
import {useAuthFormStore} from '../../features/auth/state/useAuthFormStore';
import {errorToString} from '../../shared/helpers/errorToString';
import {useMutation} from '@tanstack/react-query';
import {doLogin} from '../../features/auth/hooks/useDoLogin';
import {useStartSMSAuth} from '../../features/parsers/browser-auth/mosru';

export function SMSAuth() {
  const {colors} = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [webview, startSMSAuth] = useStartSMSAuth();
  const {form, setForm} = useAuthFormStore();
  useAuthHeader({
    header: 'Введите код из СМС',
    onBack: () => setForm({password: ''}),
  });

  const authQuery = useMutation(
    ['MosAuth'],
    async () => {
      return startSMSAuth();
    },
    {
      onSuccess({token, pid}) {
        doLogin({
          authData: form,
          sessionData: {token, pid},
          engine: 'MOS.RU',
          isAuth: true,
        });
      },
      onError(error) {
        setError(errorToString(error));
      },
    },
  );

  useEffect(() => {
    authQuery.mutate();
  }, [authQuery]);

  return (
    <View style={{flex: 1, minHeight: 100}}>
      {error ? (
        <Text style={{color: colors.problem, marginTop: 5}}>{error}</Text>
      ) : null}
      <View style={{flex: 1, display: error ? 'none' : 'flex'}}>{webview}</View>
    </View>
  );
}
