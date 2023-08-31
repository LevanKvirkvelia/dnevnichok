import {FetchQueryOptions, useQuery, useQueryClient} from '@tanstack/react-query';
import {useActiveAccount, useActiveUser} from '../../auth/hooks/useActiveUser';
import {SDate} from '../../auth/helpers/SDate';
import { getParser } from '../../parsers/getParser';

const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
// dynamic staleTime, so it will be 1 hour for last 14 days, 7 days for the rest
function getStaleTime(ddmmyyy?: string): number {
  const date = new SDate(ddmmyyy);
  const today = new SDate();
  const daysAgo = (today.getTime() - date.getTime()) / DAY;

  return daysAgo < 14 ? HOUR : WEEK;
}

export function useDayScheduleQuery(ddmmyyy: string) {
  const user = useActiveUser();
  const account = useActiveAccount();
  const parser = getParser(account.engine);
  const queryClient = useQueryClient();

  const query = useQuery(
    ['diaryDay', account.id, user.id, ddmmyyy],
    async () => {
      const result = await parser.diary.getDaysWithDay({
        account,
        user,
        sDate: new SDate(ddmmyyy),
      });

      // This code saves all diary days to cache
      result.forEach(day => {
        if (day.ddmmyyyy === ddmmyyy) return;
        queryClient.fetchQuery(['diaryDay', account.id, user.id, day.ddmmyyyy], () => day, {
          cacheTime: DAY * 180,
        });
      });

      return result.find(day => day.ddmmyyyy === ddmmyyy);
    },
    {
      cacheTime: DAY * 180,
      staleTime: getStaleTime(ddmmyyy),
    },
  );

  return query;
}