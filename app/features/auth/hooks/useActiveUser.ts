import {useMemo} from 'react';
import {Account, User, useUsersStore} from '../state/useUsersStore';

export function useActiveUser(): User;
export function useActiveUser(suspense: true): User;
export function useActiveUser(suspense: false): User | undefined;
export function useActiveUser(suspense = true): User | undefined {
  const {getActiveUser, activeAccountId, activeUserId} = useUsersStore();

  if (suspense && (!activeAccountId || !activeUserId)) {
    throw new Error('No active user');
  }

  return useMemo(() => getActiveUser(), [getActiveUser, activeAccountId, activeUserId]);
}

export function useActiveAccount(): Account;
export function useActiveAccount(suspense: true): Account;
export function useActiveAccount(suspense: false): Account | undefined;
export function useActiveAccount(suspense = true): Account | undefined {
  const {getActiveAccount, activeAccountId} = useUsersStore();

  if (suspense && !activeAccountId) {
    throw new Error('No active account');
  }

  return useMemo(() => getActiveAccount(), [getActiveAccount, activeAccountId]);
}
