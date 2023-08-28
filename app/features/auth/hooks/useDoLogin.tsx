import {errorToString} from '../../../helpers/errorToString';
import {showMessage} from '../../../ui/FlashMessage';
import {DiaryParsers, EngineNames} from '../parsers/DiaryParsers';
import {Mosru} from '../parsers/parsers/Mosru/Mosru';
import {useAuthFormStore} from '../state/useAuthFormStore';
import {
  Account,
  AccountAuthData,
  SessionData,
  User,
  useUsersStore,
} from '../state/useUsersStore';

export async function logOutIfNeeded({
  error,
  engine,
  isAuth = false,
}: {
  error: any;
  engine: EngineNames;
  isAuth?: boolean;
}) {
  const parser = DiaryParsers.get(engine);
  const account = useUsersStore.getState().getActiveAccount();

  try {
    if ('handleError' in parser && account) {
      const errorMessage = errorToString(error);

      await parser.handleError(errorMessage, account.authData);
    } else {
      throw error;
    }
  } catch (err) {
    const errorMessage = errorToString(err);

    const isLoginOrPasswordError =
      /логин|пароль/i.test(errorMessage) &&
      !errorMessage.includes('Войдите в ЭЖД заново') &&
      !isAuth;

    const isMosRuError =
      engine === 'MOS.RU' &&
      !account?.authData?.password &&
      errorMessage.includes('Войдите в ЭЖД заново');

    if (isLoginOrPasswordError || isMosRuError) {
      // TODO TEST
      useUsersStore.getState().fullLogout();
    }

    throw err;
  }
}

function changeActiveUserIfNeeded(account: Account) {
  const activeAccount = useUsersStore.getState().getActiveAccount();
  const activeUser = useUsersStore.getState().getActiveUser();

  if (
    !activeAccount ||
    activeAccount.id !== account.id ||
    !activeUser?.id ||
    !account.users[activeUser.id]
  ) {
    useUsersStore
      .getState()
      .setActiveUserId(Object.keys(account.users)[0], account.id);
  }
}

export async function processLogin({
  // TODO RENAME
  engine,
  authData,
  sessionData,
}: {
  engine: EngineNames;
  authData: AccountAuthData;
  sessionData?: SessionData;
}) {
  const activeAccount = useUsersStore.getState().getActiveAccount();

  const diaryParser = DiaryParsers.get(engine);

  const isLogin = await diaryParser.login({...authData, ...sessionData});

  if (isLogin !== true) {
    throw isLogin || new Error('Ошибка авторизации');
  }

  const students = await diaryParser.getStudents();

  // TODO Помимо авторизации получаем данные о балансе студентов (для mos.ru)
  // if (engine === 'MOS.RU') diaryParser.getBalances?.(students).then(b => dispatch(updateBalances(b)));

  const account: Account = {
    id: await diaryParser.getAccountId(),
    engine,
    sessionData:
      engine === 'MOS.RU'
        ? {
            token: (diaryParser as Mosru).session.token || sessionData?.token,
            pid: (diaryParser as Mosru).session.pid || sessionData?.pid,
          }
        : undefined,
    authData,
    accountData: {}, // ACCOUNT DATA
    users: {},
  };

  const newUsers: User[] = students.map(s => {
    let key = `${engine}:${s.profileId}`;

    return {
      id: key,
      accountId: account.id,
      userData: s,
      name: s.name,

      engine,
      settings: {},
    };
  });

  account.users = Object.fromEntries(newUsers.map(u => [u.id, u]));

  useUsersStore.getState().upsertAccount(account); // TODO KEEP USERS' SETTINGS

  // Set active user if not set, or if active account changed, or if active user is not in new users
  // TODO probably should be moved to some other place
  changeActiveUserIfNeeded(account);
}

export async function doLogin({
  authData,
  sessionData,
  engine,
  isAuth = false,
}: {
  authData: AccountAuthData;
  sessionData?: SessionData;
  engine: EngineNames;
  isAuth?: boolean;
}) {
  try {
    await processLogin({engine, authData, sessionData});
    return true;
  } catch (error) {
    const errorMessage = errorToString(error);
    console.log(error);

    useAuthFormStore.getState().setError(errorMessage);

    try {
      await logOutIfNeeded({error, engine, isAuth});
    } catch (err) {
      showMessage({
        message: errorToString(err),
        type: 'default',
      });
    }
  }
}
