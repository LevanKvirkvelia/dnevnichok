import {errorToString} from '../../../shared/helpers/errorToString';
import {showMessage} from '../../../ui/FlashMessage';
import {EngineNames, getParser} from '../../parsers/parsers/getParser';

import {useAuthFormStore} from '../state/useAuthFormStore';
import {Account, AccountAuthData, SessionData, User, useUsersStore} from '../state/useUsersStore';

export async function logOutIfNeeded({
  error,
  engine,
  isAuth = false,
}: {
  error: any;
  engine: EngineNames;
  isAuth?: boolean;
}) {
  throw error;
  //   const account = useUsersStore.getState().getActiveAccount();

  //   try {
  //     if ('handleError' in parser && account) {
  //       const errorMessage = errorToString(error);

  //       await parser.handleError(errorMessage, account.authData);
  //     } else {
  //       throw error;
  //     }
  //   } catch (err) {
  //     const errorMessage = errorToString(err);

  //     const isLoginOrPasswordError =
  //       /логин|пароль/i.test(errorMessage) &&
  //       !errorMessage.includes('Войдите в ЭЖД заново') &&
  //       !isAuth;

  //     const isMosRuError =
  //       engine === 'MOS.RU' &&
  //       !account?.authData?.password &&
  //       errorMessage.includes('Войдите в ЭЖД заново');

  //     if (isLoginOrPasswordError || isMosRuError) {
  //       // TODO TEST
  //       useUsersStore.getState().fullLogout();
  //     }

  //     throw err;
  //   }
}

function changeActiveUserIfNeeded(account: Account) {
  const activeAccount = useUsersStore.getState().getActiveAccount();
  const activeUser = useUsersStore.getState().getActiveUser();

  if (!activeAccount || activeAccount.id !== account.id || !activeUser?.id || !account.users[activeUser.id]) {
    useUsersStore.getState().setActiveUserId(Object.keys(account.users)[0], account.id);
  }
}

export async function processLogin({
  engine,
  authData,
  sessionData,
}: {
  engine: EngineNames;
  authData: AccountAuthData;
  sessionData?: SessionData;
}) {
  const parser = getParser(engine);

  const account: Account = {
    id: await parser.auth.getAccountId({authData, sessionData}),
    engine,
    sessionData,
    authData,
    accountData: {}, // ACCOUNT DATA
    users: {},
  };

  const students = await parser.auth.getStudents({authData, sessionData});

  const newUsers: User[] = students.map(s => {
    let key = `${engine}:${s.id}`; // TODO USE ID

    return {
      ...s,
      accountId: account.id,
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
    const parser = getParser(engine);
    const newSessionData = await parser.auth.login!({authData, sessionData});

    await processLogin({engine, authData, sessionData: newSessionData});
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
