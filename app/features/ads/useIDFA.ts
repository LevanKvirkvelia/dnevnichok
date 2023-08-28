import {Platform} from 'react-native';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useCallback, useEffect, useState} from 'react';

export async function getIDFA() {
  const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
  if (result === RESULTS.DENIED)
    await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
}

export function useIDFA(allowAsk = false) {
  const [isShowing, setShow] = useState(Platform.OS !== 'ios');
  const checkAndRequestPermission = useCallback(async () => {
    if (!allowAsk) return;
    await getIDFA();
    setShow(true);
  }, [allowAsk]);

  useEffect(() => {
    checkAndRequestPermission().catch(console.log);
  }, [checkAndRequestPermission]);

  return isShowing;
}
