import {useActiveUser} from '../auth/hooks/useActiveUser';
import {useAdsStore} from './useAdsStore';
import {useIDFA} from './useIDFA';

const DAY = 24 * 60 * 60 * 1000;

export function useCanShowAd() {
  const isIDFA = useIDFA(true);
  const user = useActiveUser(false);
  const {firstAuth} = useAdsStore();

  return !!user && isIDFA && firstAuth < Date.now() - 5 * DAY;
}
