import {QueryClient, UseQueryOptions, useQueries, useQuery, useQueryClient} from '@tanstack/react-query';
import {useActiveAccount, useActiveUser} from '../../auth/hooks/useActiveUser';
import {getParser} from '../../parsers/getParser';
import {IPeriod} from '../../parsers/data/types';
import { Account, User } from '../../auth/state/useUsersStore';

const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24;

/* 
  * This hook is used to get period data from cache or from server
  * We are trying to minimize requests to server, that's why we
  * have such complex logic here, but it is actually simple:
  
  * We need to get period data and periods length to render the periods screen
  * Some engines does not have getAllPeriodsQuick method, which returns all periods
  * Some engines does not have getPeriods*Len*Quick method, which returns periods length
  * 
  * If the engine has getAllPeriodsQuick method, we use it to get all periods, and then
  * we use the same result to get the period we need, and the length of periods
  * which is kinda saves us from making 1 request to server
  * 
  * If the engine does not have getAllPeriodsQuick method, we use getPeriods*Len*Quick
  * method to get the length of periods, and then we use getPeriodsWith method to get
  * the period we need. 
  * 
  * This logic also supports refetching, so if the user wants to refetch the period,
  * we will refetch the period and the length of periods
  * But the request would not be done twice, because we use react-query
*/


function allPeriodsQueryOptions(account: Account, user: User, queryClient: QueryClient) {
  const parser = getParser(account.engine);
  return ({
    queryKey: ['allPeriods', account.id, user.id],
    async queryFn({ queryKey }) {
      const result = await parser.periods.getAllPeriodsQuick!({ account, user });

      // This code saves all diary days to cache
      result.map(period => {
        return queryClient.fetchQuery(['period', account.id, user.id, period.id], () => period, {
          cacheTime: DAY * 180,
        });
      });

      return result;
    },
    cacheTime: DAY * 180,
    staleTime: HOUR,
  } satisfies UseQueryOptions<IPeriod[], Error, IPeriod[], [string, string, string]>);
}

export function useAllPeriodsQuery() {
  const user = useActiveUser();
  const account = useActiveAccount();
  const queryClient = useQueryClient();

  return useQuery(allPeriodsQueryOptions(account, user, queryClient));
}

export function usePeriodsLenQuery() {
  const user = useActiveUser();
  const account = useActiveAccount();
  const parser = getParser(account.engine);
  const queryClient = useQueryClient();

  return useQueries({
    queries: [
      parser.periods.getAllPeriodsQuick
        ? {
            ...allPeriodsQueryOptions(account, user, queryClient),
            placeholderData: [],
            select: (data: IPeriod[]) => data.length,
          }
        : {
            queryKey: ['periodsLen', account.id, user.id],
            async queryFn() {
              return parser.periods.getPeriodsLenQuick!({account, user});
            },
            cacheTime: DAY * 180,
            staleTime: HOUR,
            placeholderData: 0,
          },
    ],
  })[0];
}

export function usePeriodQuery(periodNumber: number | string) {
  const user = useActiveUser();
  const account = useActiveAccount();
  const parser = getParser(account.engine);
  const queryClient = useQueryClient();

  const periodsLenQuery = usePeriodsLenQuery();

  const periodQuery = useQueries({
    queries: [
      parser.periods.getAllPeriodsQuick
        ? {
            ...allPeriodsQueryOptions(account, user, queryClient),
            select: (data: IPeriod[]) => data.find(period => period.id === periodNumber),
          }
        : {
            queryKey: ['period', account.id, user.id, String(periodNumber)],
            async queryFn() {
              const result = await parser.periods.getPeriodsWith({
                account,
                user,
                period: periodNumber,
              });

              // This code saves all diary days to cache
              result.forEach(period => {
                if (period.id === periodNumber) return;
                queryClient.fetchQuery(['diaryDay', account.id, user.id, period.id], () => period, {
                  cacheTime: DAY * 180,
                });
              });

              return result.find(period => period.id === periodNumber);
            },
            cacheTime: DAY * 180,
            staleTime: HOUR,
          },
    ],
  })[0];

  return {
    periodsLenQuery,
    periodQuery,
  };
}
