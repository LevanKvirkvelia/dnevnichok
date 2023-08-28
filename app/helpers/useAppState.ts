import {AppState, AppStateStatus} from 'react-native';
import {useState, useEffect} from 'react';
import {useGetLatest} from './useGetLatest';

export type AppStateEvent = 'open' | 'start' | 'close';

export const EVENTS = ['open', 'start', 'close'];

export function useAppState(
  callback: (event: AppStateEvent) => void,
  events: AppStateEvent[],
) {
  if (
    !events ||
    !Array.isArray(events) ||
    events.find(v => !EVENTS.includes(v))
  ) {
    throw new Error(
      `Wrong events in useAppState. One of 'open', 'start', 'close'`,
    );
  }

  const fn = useGetLatest(callback);
  const [, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    if (events.includes('start')) {
      fn('start');
    }

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      setAppState(appState => {
        if (
          appState.match(/inactive|background/) &&
          nextAppState === 'active' &&
          events.includes('open')
        ) {
          fn('open');
        } else if (
          appState === 'active' &&
          nextAppState.match(/inactive|background/) &&
          events.includes('close')
        ) {
          fn('close');
        }

        return nextAppState;
      });
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn]);
}
