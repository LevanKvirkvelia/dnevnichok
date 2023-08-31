import {useMemo} from 'react';
import {usePeriodQuery} from './usePeriodQuery';
import {useUserPeriodsState} from '../state/usePeriodsState';

export function useSubjectMarksByDate(subjectId: string, ddmmyyyy: string) {
  const {activePeriodNumber} = useUserPeriodsState();
  const {periodQuery} = usePeriodQuery(activePeriodNumber);

  return useMemo(() => {
    const marks = periodQuery.data?.subjects.find(subject => subject.id == subjectId)?.marks;

    return marks?.filter(mark => mark.date == ddmmyyyy) || [];
  }, [periodQuery.data, ddmmyyyy]);
}
