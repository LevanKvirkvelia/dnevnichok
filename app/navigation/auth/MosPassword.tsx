import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {useAuthHeader} from '../../features/auth/hooks/useAuthHeader';
import {useAuthFormStore} from '../../features/auth/state/useAuthFormStore';
import {errorToString} from '../../helpers/errorToString';
import {useTheme} from '../../features/themes/useTheme';

import {useMutation} from '@tanstack/react-query';
import {doLogin} from '../../features/auth/hooks/useDoLogin';
import {useVisibleMosAuth} from '../../features/auth/parsers/browser-auth/helpers/mosru';

export function MosPassword() {
  const {colors} = useTheme();

  const [error, setError] = useState<string | null>(null);
  const [webview, startAuth] = useVisibleMosAuth(); // TODO RENAME startAuth

  const {form, setForm} = useAuthFormStore();

  useAuthHeader({header: 'MOS.RU', onBack: () => setForm({password: ''})});
  const authQuery = useMutation(
    ['MosAuth'],
    async () => {
      return startAuth();
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
