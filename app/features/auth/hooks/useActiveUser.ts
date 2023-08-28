import {useMemo} from 'react';
import {useUsersStore} from '../state/useUsersStore';

export function useActiveUser() {
  const {getActiveUser, activeAccountId, activeUserId} = useUsersStore();

  return useMemo(
    () => getActiveUser(),
    [getActiveUser, activeAccountId, activeUserId],
  );
}

export function useActiveAccount() {
  const {getActiveAccount, activeAccountId, activeUserId} = useUsersStore();

  return useMemo(() => getActiveAccount(), [getActiveAccount, activeAccountId]);
}
