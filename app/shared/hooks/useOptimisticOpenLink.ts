import {useCallback} from 'react';

import {Linking} from 'react-native';
import {useInAppBrowser} from '../../navigation/InAppBrowser';

export function openLink(url: string) {
  Linking.openURL(url).catch(error => console.log({error}));
}

export function useOptimisticOpenLink() {
  const navigateWeb = useInAppBrowser();

  return useCallback((link: string) => {
    if (
      link.includes('zoom.us') ||
      link.includes('conference/?scheduled_lesson_id') ||
      link.includes('teams.microsoft.com')
    ) {
      openLink(link);
    } else {
      navigateWeb({startUrl: link});
    }
  }, []);
}
