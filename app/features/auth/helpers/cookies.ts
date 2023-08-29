import {Platform} from 'react-native';
import CookieManager from '@react-native-cookies/cookies';

export async function clearCookies() {
  return Promise.all([CookieManager.clearAll(true), CookieManager.clearAll()]);
}

export async function getCookie(url: string, name: string) {
  const empty = Promise.resolve({} as never);

  return Promise.all([
    Platform.OS === 'ios' ? CookieManager.getAll() : empty,
    Platform.OS === 'ios' ? CookieManager.getAll(true) : empty,
    CookieManager.get(url),
    CookieManager.get(url, true),
  ]).then(([allCookies, allCookiesWebkit, urlCookies, urlCookiesWebkit]) => {
    let cookie = null;

    try {
      const cookies = {
        ...allCookies[name],
        ...allCookiesWebkit[name],
        ...urlCookies[name],
        ...urlCookiesWebkit[name],
      };
      cookie = `${name}=${cookies.value || ''};`;
    } catch (e) {
      console.error(`Can't get "${name}" cookie from ${url}`);
      throw new Error('Не удалось авторизоваться');
    }

    return cookie;
  });
}
