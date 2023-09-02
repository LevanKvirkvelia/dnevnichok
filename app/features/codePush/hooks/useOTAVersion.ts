import {useQuery} from '@tanstack/react-query';
import codePush from 'react-native-code-push';

export function useOTAVersionQuery() {
  const query = useQuery(['otaVersion'], () => codePush.getUpdateMetadata().then(v => v || 'bundle'), {
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24 * 365,
    select: currentVersion =>
      currentVersion === 'bundle' ? currentVersion : `${currentVersion.appVersion}(${currentVersion.label})`,
  });

  return query;
}
