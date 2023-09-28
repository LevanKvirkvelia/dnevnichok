import {useMemo} from 'react';
import {ISubjectPeriod} from '../../parsers/data/types';
import {useActiveUser} from '../../auth/hooks/useActiveUser';
import {useTheme} from '../../themes/useTheme';
import {getAverageMark, isInt} from '../utils';

function getStatus(middle: number | string, target: number) {
  if (!middle) return 'nothing';
  if (+middle >= target - 0.3) return 'good';
  if (+middle >= target - 0.5) return 'normal';
  return 'problem';
}

export function useProcessedSubjectPeriod(subjectPeriod?: ISubjectPeriod) {
  const user = useActiveUser();
  const {colors} = useTheme();
  const average = useMemo(() => {
    return getAverageMark(subjectPeriod);
  }, [subjectPeriod?.forcedAverage, subjectPeriod?.marks]);

  const status = getStatus(average, user.settings.target);

  return {
    average,
    status,
    color: colors[status] || colors.nothing,
  };
}
