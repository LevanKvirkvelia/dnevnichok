import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';
import {EngineNames} from '../parsers/DiaryParsers';

export type UserSettings = {
  showSaturday?: boolean;
  target?: number;
};

export type User = {
  id: string;
  accountId: string;

  name: string;
  engine: EngineNames;

  parsedData: {
    schoolId: string | number;
    classId: string | number;
    schoolName: string;
    className: string;
  };

  engineUserData?: any;
  settings?: UserSettings;
};

export type ParsedUser = Omit<User, 'accountId'>;

export type AccountAuthData = {
  login: string;
  password?: string;
};

export type SessionData = {
  token?: string;
  pid?: string;
};

export type Account = {
  id: string;
  engine: EngineNames;

  authData: AccountAuthData;
  sessionData?: SessionData;
  accountData: any;

  users: {[id: string]: User};
};

interface UsersState {
  accounts: {[id: string]: Account};
  activeAccountId?: string;
  activeUserId?: string;

  setActiveUserId: (id: string, accountId: string) => void;

  upsertAccount: (account: Partial<Account> & Pick<Account, 'id'>) => void;
  removeAccount: (index: number) => void;
  fullLogout: () => void;

  getUsers: () => User[];
  getActiveUser: () => User | undefined;
  getActiveAccount: () => Account | undefined;
}

export const useUsersStore = create<UsersState>()((set, get) => ({
  accounts: {},
  activeAccountId: undefined,
  activeUserId: undefined,
  setActiveUserId: (id: string, accountId: string) => {
    set(state => ({
      ...state,
      activeUserId: id,
      activeAccountId: accountId,
    }));
  },

  upsertAccount: (account: Partial<Account> & Pick<Account, 'id'>) => {
    set(state => ({
      ...state,
      accounts: {
        ...state.accounts,
        [account.id]: {
          ...state.accounts[account.id],
          ...account,
        },
      },
    }));
  },

  removeAccount: (index: number) => {
    set(state => {
      const newAccounts = {...state.accounts};
      delete newAccounts[index];
      return {
        ...state,
        accounts: newAccounts,
      };
    });
  },

  fullLogout: () => {
    set(state => ({
      ...state,
      accounts: {},
      activeAccountId: undefined,
      activeUserId: undefined,
    }));
  },

  getUsers: () => {
    const state = get();
    return Object.values(state.accounts).flatMap(account =>
      Object.values(account.users),
    );
  },

  getActiveUser: () => {
    const state = get();
    if (!state.activeAccountId || !state.activeUserId) return undefined;
    return state.accounts[state.activeAccountId]?.users[state.activeUserId];
  },

  getActiveAccount: () => {
    const state = get();
    if (!state.activeAccountId) return undefined;
    return state.accounts[state.activeAccountId];
  },
}));
