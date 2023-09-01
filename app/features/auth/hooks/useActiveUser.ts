import {useMemo} from 'react';
import {Account, User, useUsersStore} from '../state/useUsersStore';

export function useActiveUser(): User;
export function useActiveUser(suspense: true): User;
export function useActiveUser(suspense: false): User | undefined;
export function useActiveUser(suspense = true): User | undefined {
  const {activeAccountId, activeUserId, accounts} = useUsersStore();

  if (suspense && (!activeAccountId || !activeUserId)) {
    throw new Error('No active user');
  }

  return useMemo(() => {
    const user = accounts[activeAccountId!]?.users[activeUserId!];
    return {
      ...user,
      settings: {
        // @ts-ignore // TODO FIX
        showSaturday: true,
        // @ts-ignore // TODO FIX
        target: 5,
        ...user.settings,
      },
    };
  }, [activeAccountId, activeUserId, accounts]);
}

export function useActiveAccount(): Account;
export function useActiveAccount(suspense: true): Account;
export function useActiveAccount(suspense: false): Account | undefined;
export function useActiveAccount(suspense = true): Account | undefined {
  const {activeAccountId, accounts} = useUsersStore();

  if (suspense && !activeAccountId) {
    throw new Error('No active account');
  }

  return accounts[activeAccountId!];
}
