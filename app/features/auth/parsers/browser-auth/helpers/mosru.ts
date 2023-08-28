import {useCallback, useEffect, useRef} from 'react';
import {HeadlessBrowserHandlers, useHeadlessBrowser} from '../HeadlessBrowser';
import {DiaryParsers} from '../../DiaryParsers';
import {Mosru} from '../../parsers/Mosru/Mosru';
import {Request} from '../../request/Request';
import {setUrlParams} from '../../helpers/setUrlParams';
import {useUsersStore} from '../../../state/useUsersStore';
import {useGetLatest} from '../../../../../helpers/useGetLatest';
import {useAuthFormStore} from '../../../state/useAuthFormStore';
import {useActiveUser} from '../../../hooks/useActiveUser';

export function InjectMosAuth() {
  const doRelogin = useHeadlessRelogin();
  const {upsertAccount} = useUsersStore();

  useEffect(() => {
    const parser = DiaryParsers.get('MOS.RU') as Mosru;
    // TODO REFACTOR bad hack
    parser.__login = async (login, password) => {
      if (!password) {
        parser.resolveAuthed(); // TODO CHECK WTF IS THIS
        return true;
      }

      const {token, pid} = await doRelogin(login, password);

      if (token && pid) {
        upsertAccount({
          id: await parser.getAccountId(),
          sessionData: {token, pid},
        });
        return true;
      }
      return false;
    };
  }, [doRelogin, upsertAccount]);

  return null;
}

export function useHeadlessRelogin() {
  const browser = useHeadlessBrowser();

  const fillTheForm = useCallback(
    async (login: string, password: string) => {
      await browser.waitForSelector('input[name="password"]');
      await browser.timeout(200);

      await browser.evaluate(
        `function (){
					const $notMe = document.querySelector('.profile-name button');
					if ($notMe) $notMe.click();
				}`,
      );

      await browser.waitForSelector('input[name="login"]');

      await browser.evaluate(
        `function (loginArg){
					const $login = document.querySelector('input[name="login"]');
					if ($login) $login.value = loginArg; 
				}`,
        login,
      );
      await browser.waitForSelector('input[name="password"]');
      await browser.evaluate(
        `function (passwordArg){
					const $password = document.querySelector('input[name=password]');
					if ($password) $password.value = passwordArg;
				}`,
        password,
      );
    },
    [browser],
  );

  const secondOnRequest = useRef<((url: string) => boolean) | null>(null);
  const isForced = useRef<boolean | null>(false);

  return useGetLatest(
    (
      login: string,
      password: string,
    ): Promise<{
      token: string;
      pid: string;
    }> => {
      isForced.current = false;
      function setForced() {
        isForced.current = true;
        browser.setForcedVisibility(true);
      }

      const tokenOrTimeout = new Promise<{token: string; pid: string}>(
        (_resolve, reject) => {
          setTimeout(() => {
            if (!isForced.current)
              reject(
                new Error(
                  'Время ожидания истекло. Проверьте введенные данные и попробуйте снова',
                ),
              );
          }, 1000 * 35);

          browser.onClose(() =>
            reject(new Error('Прервана процедура авторизации')),
          );
          return trackSuccessUrl(
            func => (secondOnRequest.current = func),
            browser.close,
          );
        },
      );

      // костыль, чтобы сделать 2 onRequest. Один уйдет в trackUrl, а второй для заполнения формы
      browser.onRequest(url => {
        if (url.includes('/login/methods/password')) {
          fillTheForm(login, password);
        }
        return secondOnRequest.current?.(url) || true;
      });

      const submitOrError = (async () => {
        await browser.goto(`https://school.mos.ru/v1/sudir/main/auth`);

        await fillTheForm(login, password);

        const value = await browser.evaluate(
          `function (loginArg, passwordArg){
					const $captcha = document.querySelector('#captcha_container');
					if($captcha.children.length) return 'force';
					
					const $form = document.querySelector('#loginFm');
					if ($form) $form.submit();
				}`,
        );

        if (value === 'force') {
          return setForced();
        }

        await browser.waitForSelector('.blockquote-danger');

        const errorText = await browser.evaluate(`function (){
					const $error = document.querySelector('.blockquote-danger');
					const text = $error ? $error.innerText : '';
					return text;
				}`);

        if (errorText.includes('Вы ввели неверный ответ')) {
          return setForced();
        }
        throw new Error(
          errorText.includes('логин или пароль')
            ? 'Неправильный логин или пароль'
            : errorText,
        );
      })();

      return Promise.race([
        tokenOrTimeout,
        submitOrError as unknown as Promise<{
          token: string;
          pid: string;
        }>,
      ]);
    },
  );
}

function trackSuccessUrl(
  onRequest: HeadlessBrowserHandlers['onRequest'],
  close: HeadlessBrowserHandlers['close'],
) {
  return new Promise<{token: string; pid: string}>((resolve, reject) => {
    onRequest(url => {
      if (url?.includes('code=')) {
        (async () => {
          const parser = DiaryParsers.get('MOS.RU') as Mosru;

          parser.r = new Request('mos.ru:'); // TODO Request remove
          await parser.getToken(url);

          const {token, pid} = parser.session;
          if (!token || !pid) throw new Error('Не удалось получить токен');

          resolve({
            token,
            pid,
          });
          close();
        })();
        return false;
      }
      return true;
    });
  });
}

export function useStartSMSAuth() {
  const browser = useHeadlessBrowser({headless: false});

  const {setForm} = useAuthFormStore();

  const startSMSAuth = useGetLatest(async () => {
    const successPromise = trackSuccessUrl(browser.onRequest, browser.close);

    const errorHandler = new Promise((resolve, reject) => {
      browser.onError(reject);
    });

    const runner = (async () => {
      await browser.goto(`https://school.mos.ru/v1/sudir/main/logout`);

      await browser.goto(`https://school.mos.ru/v1/sudir/main/auth`);

      const passwordSelector = 'input[name="password"]';
      await browser.waitForSelector(passwordSelector);

      await browser.waitForSelector('.methods-int a');
      await browser.evaluate(
        `function (){
					const $bySMS = document.querySelectorAll(".methods-int a");
					if($bySMS && $bySMS[1]) $bySMS[1].click();
				}`,
      );

      await browser.waitForText('Отправить');

      const loginSelector = 'input[name="login"]';
      await browser.waitForSelector(loginSelector);
      const onEvent = `function(event){ return event.target && (event.target).value || '' }`;
      const handleLogin = (value: string) => {
        setForm({login: value});
      };
      browser.subscribe('input', handleLogin, onEvent, loginSelector);
    })();

    // type hack, since other promises just throw error
    return Promise.race([
      successPromise,
      errorHandler,
      runner,
    ]) as typeof successPromise;
  });

  return [browser.webview, startSMSAuth] as const;
}

export function useVisibleMosAuth() {
  const browser = useHeadlessBrowser({headless: false});

  const {form, setForm} = useAuthFormStore();
  const startAuth = useGetLatest(async () => {
    const successPromise = trackSuccessUrl(browser.onRequest, browser.close);

    await browser.goto(`https://school.mos.ru/v1/sudir/main/auth`);

    const loginSelector = 'input[name="login"]';
    const passwordSelector = 'input[name="password"]';

    await browser.waitForSelector(loginSelector);
    console.log('waited for selector');

    await browser.evaluate(
      `function (loginArg){
      const $notMe = document.querySelector('.profile-name button');
      if ($notMe) $notMe.click();
      const $login = document.querySelector('input[name="login"]');
      if ($login && loginArg) $login.value = loginArg;
    }`,
      form.login,
    );

    const onEvent = `function(event){ return event.target && (event.target).value || '' }`;

    browser.subscribe(
      'input',
      (v: string) => {
        setForm({login: v});
      },
      onEvent,
      loginSelector,
    );
    browser.subscribe(
      'input',
      (v: string) => setForm({password: v}),
      onEvent,
      passwordSelector,
    );

    return successPromise;
  });

  return [browser.webview, startAuth] as const;
}

export function useRefreshMosLink() {
  // todo weird function
  const activeUser = useActiveUser();

  return useCallback(
    (url: string) => {
      if (!activeUser || activeUser.engine !== 'MOS.RU') return url;

      const parser = DiaryParsers.get('MOS.RU') as Mosru;
      const {token, pid} = parser.session || {};

      if (!token || !pid) return url;

      return setUrlParams(url, {authToken: token, profileId: pid});
    },
    [activeUser],
  );
}
