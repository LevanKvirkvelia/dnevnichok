import {useRef, useLayoutEffect, useCallback} from 'react';


export type AnyFunction = (...args: any[]) => any;

export function useGetLatest<T extends AnyFunction>(fn: T): T {
  const ref = useRef<T>(fn);

  useLayoutEffect(() => {
    ref.current = fn;
  });

  return useCallback((...args: Parameters<T>) => ref.current(...args), []) as T;
}
