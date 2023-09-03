import messaging from '@react-native-firebase/messaging';
import {useQuery} from '@tanstack/react-query';
import {useMMKVBoolean} from 'react-native-mmkv';
import {AsyncAlert} from '../helpers/AsyncAlert';
import {useEffect} from 'react';

async function requestPermission() {
  const answer = await AsyncAlert({
    title: 'Разрешить отправку пуш-уведомлений?',
    buttons: [{text: 'Запретить'}, {text: 'Разрешить'}],
  });

  if (answer == 'Разрешить') {
    await messaging().requestPermission();
  }
}

export function usePushMessages() {
  const [isFakePushRequested = false, setIsFakePushRequested] = useMMKVBoolean('isFakePushRequested');

  const permissionQuery = useQuery(['pushPermission'], () => messaging().hasPermission());

  useEffect(() => {
    if (typeof permissionQuery.data === 'undefined') return;

    if (permissionQuery.data === messaging.AuthorizationStatus.DENIED) {
      setIsFakePushRequested(true);
      return;
    }

    if (permissionQuery.data === messaging.AuthorizationStatus.AUTHORIZED) {
      messaging().requestPermission();
      return;
    }

    if (!isFakePushRequested) {
      setIsFakePushRequested(true);
      requestPermission();
    }
  }, [permissionQuery.data, isFakePushRequested]);
}
