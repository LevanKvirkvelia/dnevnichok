import {useState, useEffect} from 'react';
import {Text, View, ViewProps} from 'react-native';

export function useBackwardTimer({endTime}: {endTime: number}) {
  const [time, setTime] = useState(endTime - new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(endTime - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const minutes = Math.floor(time / 1000 / 60);
  const seconds = Math.floor((time / 1000) % 60);

  return time > 0 ? ([minutes, seconds] as const) : null;
}
