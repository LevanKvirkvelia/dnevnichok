import {PropsWithChildren, useContext, useEffect, useState} from 'react';
import {getParser} from '../../parsers/getParser';
import {useActiveAccount, useActiveUser} from '../hooks/useActiveUser';
import {QueryCache, QueryClient, UseQueryResult, useQuery} from '@tanstack/react-query';
import {processLogin} from '../hooks/useDoLogin';
import {errorToString} from '../../../shared/helpers/errorToString';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import {mmkvClientPersister} from '../../../shared/helpers/mmkvClientPersister';
import React from 'react';
import {showMessage} from '../../../ui/FlashMessage';

/*
MOS: if has password and login, then do background login ONLY when token is expired
MOS: if has no password and login, then logout if token is expired

Other: if has password and login, then do background login every time
*/

const ignoreQueryKeys = ['codePush'];

// @ts-ignore
const SessionContext = React.createContext<UseQueryResult<boolean, unknown>>(null);

export function SessionProvider({children}: PropsWithChildren<{}>) {
  const user = useActiveUser();
  const account = useActiveAccount();
  const parser = getParser(user.engine);

  const isNeedBackgroundLoginOnStart = user.engine !== 'MOS.RU';

  const sessionQuery = useQuery(
    ['refetchSession', user.id, account.id],
    async () => {
      const {engineAccountData, sessionData} = await parser.auth.backgroundLogin!(account);

      await processLogin({
        authData: account.authData,
        engineAccountData,
        sessionData,
        engine: account.engine,
      });

      return true;
    },
    {
      refetchOnWindowFocus: true,

      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnReconnect: false,

      placeholderData: isNeedBackgroundLoginOnStart ? false : true,
      enabled: isNeedBackgroundLoginOnStart,

      staleTime: 1000 * 60 * 15,
      retry(failureCount, error) {
        // todo make it better
        showMessage({message: errorToString(error)});
        // todo check if bad login or password
        return false;
      },
    },
  );

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError(error, query) {
            const key = typeof query.queryKey?.[0];
            if (typeof key === 'string' && ignoreQueryKeys.some(key => key.startsWith(key))) return;
            showMessage({message: errorToString(error)});
          },
        }),
        defaultOptions: {
          queries: {
            cacheTime: 0,
            staleTime: 0,
            retry: 2,
            retryDelay: 2000,
            refetchInterval: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
          },
        },
      }),
  );

  return (
    <SessionContext.Provider value={sessionQuery}>
      <PersistQueryClientProvider client={queryClient} persistOptions={{persister: mmkvClientPersister}}>
        {children}
      </PersistQueryClientProvider>
    </SessionContext.Provider>
  );
}

export function useSessionQuery() {
  const context = useContext(SessionContext);
  return context;
}
