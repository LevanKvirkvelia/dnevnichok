import {create} from 'zustand';
import {EngineNames} from '../../parsers/parsers/getParser';
import {createJSONStorage, persist} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
import {zustandStorage} from '../../../shared/helpers/zustandStorage';

export type UserSettings = {
  showSaturday: boolean;
  target: number;
};

export type User = {
  id: string; // Global Public User Id
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
  settings: UserSettings;
};

export type ParsedUser = Omit<User, 'accountId' | 'settings'>;

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
  setUserSettings: (settings: Partial<UserSettings>) => void;
}

export const useUsersStore = create<UsersState>()(
  persist(
    immer<UsersState>((set, get) => ({
      accounts: {},
      activeAccountId: undefined,
      activeUserId: undefined,
      setActiveUserId: (id, accountId) => {
        set(state => {
          state.activeUserId = id;
          state.activeAccountId = accountId;
        });
      },

      upsertAccount: account => {
        set(state => {
          state.accounts[account.id] = {
            ...state.accounts[account.id],
            ...account,
          };
        });
      },

      removeAccount: index => {
        set(state => {
          delete state.accounts[index];
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
        return Object.values(state.accounts).flatMap(account => Object.values(account.users));
      },

      getActiveUser: () => {
        const state = get();
        if (!state.activeAccountId || !state.activeUserId) return undefined;
        const activeUser = state.accounts[state.activeAccountId]?.users[state.activeUserId];
        return {
          ...activeUser,
          settings: {
            // TODO remove this after proper auth
            showSaturday: activeUser.settings.showSaturday ?? true,
            target: activeUser.settings.target ?? 5,
          },
        };
      },

      getActiveAccount: () => {
        const state = get();
        if (!state.activeAccountId) return undefined;
        return state.accounts[state.activeAccountId];
      },

      setUserSettings: settings => {
        set(state => {
          if (!state.activeAccountId || !state.activeUserId) return;
          const user = state.accounts[state.activeAccountId].users[state.activeUserId];
          state.accounts[state.activeAccountId].users[state.activeUserId].settings = {
            ...user.settings,
            ...settings,
          };
        });
      },
    })),
    {
      name: 'users-store',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
