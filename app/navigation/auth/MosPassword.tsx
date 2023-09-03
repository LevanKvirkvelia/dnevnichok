import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {useAuthHeader} from '../../features/auth/hooks/useAuthHeader';
import {useAuthFormStore} from '../../features/auth/state/useAuthFormStore';
import {errorToString} from '../../shared/helpers/errorToString';
import {useTheme} from '../../features/themes/useTheme';

import {useMutation} from '@tanstack/react-query';
import {processLogin} from '../../features/auth/hooks/useDoLogin';
import {useVisibleMosAuth} from '../../features/parsers/browser-auth/mosru';
import {NavigationProp, useNavigation} from '@react-navigation/native';

export function MosPassword() {
  const {colors} = useTheme();

  const [error, setError] = useState<string | null>(null);
  const [webview, startAuth] = useVisibleMosAuth(); // TODO RENAME startAuth

  const {form, setForm} = useAuthFormStore();

  const navigation = useNavigation();

  useAuthHeader({header: 'MOS.RU', onBack: () => setForm({password: ''})});
  const {mutate} = useMutation(
    ['MosAuth'],
    async () => {
      const {sessionData, engineAccountData} = await startAuth();

      await processLogin({
        authData: form,
        engine: 'MOS.RU',
        sessionData,
        engineAccountData,
      });

      return true;
    },
    {
      onSuccess() {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Tabs',
              state: {
                routes: [{name: 'DiaryTab'}],
              },
            },
          ],
        });
      },
      onError(error) {
        setError(errorToString(error));
      },
    },
  );

  useEffect(() => {
    console.log('authQuery');
    mutate();
  }, [mutate]);

  return (
    <View style={{flex: 1, minHeight: 100}}>
      {error ? <Text style={{color: colors.problem, marginTop: 5}}>{error}</Text> : null}
      <View style={{flex: 1, display: error ? 'none' : 'flex'}}>{webview}</View>
    </View>
  );
}
