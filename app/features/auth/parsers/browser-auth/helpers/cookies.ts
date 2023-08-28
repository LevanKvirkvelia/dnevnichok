import {Platform} from 'react-native';

export async function clearCookies() {
  if (Platform.OS === 'web') return;

  const CookieManager = await import('@react-native-cookies/cookies').then(
    m => m.default,
  );

  return Promise.all([CookieManager.clearAll(true), CookieManager.clearAll()]);
}

export async function getCookie(url: string, name: string) {
  if (Platform.OS === 'web') return;

  const CookieManager = await import('@react-native-cookies/cookies').then(
    m => m.default,
  );

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
