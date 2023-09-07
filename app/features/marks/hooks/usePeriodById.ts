import {useUserPeriodsState} from '../state/usePeriodsState';
import {usePeriodQuery} from './usePeriodQuery';

export function useSubjectPeriodById(subjectId: string | number) {
  const {activePeriodNumber} = useUserPeriodsState();
  const {periodQuery} = usePeriodQuery(activePeriodNumber);

  return periodQuery.data?.subjects.find(subject => subject.id.toString() == subjectId.toString());
}
