import {useQuery} from '@tanstack/react-query';
import codePush from 'react-native-code-push';

export function useOTAVersionQuery() {
  const query = useQuery(['otaVersion'], () => codePush.getUpdateMetadata().then(v => v || 'bundle'), {
    refetchOnWindowFocus: true,
    select: currentVersion =>
      currentVersion === 'bundle' ? currentVersion : `${currentVersion.appVersion}(${currentVersion.label})`,
  });

  return query;
}
