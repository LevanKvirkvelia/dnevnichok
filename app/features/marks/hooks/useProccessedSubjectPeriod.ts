import {useMemo} from 'react';
import {ISubjectPeriod} from '../../parsers/data/types';
import {useActiveUser} from '../../auth/hooks/useActiveUser';
import {useTheme} from '../../themes/useTheme';

function getStatus(middle: number | string, target: number) {
  if (!middle) return 'nothing';
  if (+middle >= target - 0.3) return 'good';
  if (+middle >= target - 0.5) return 'normal';
  return 'problem';
}

export function useProcessedSubjectPeriod(subjectPeriod: ISubjectPeriod) {
  const user = useActiveUser();
  const {colors} = useTheme();
  const average = useMemo(() => {
    return (
      subjectPeriod.forcedAverage ||
      subjectPeriod.marks
        .map(mark => (+mark.value * mark.weight) / subjectPeriod.marks.length)
        .reduce((a, b) => a + b, 0)
    );
  }, [subjectPeriod.forcedAverage, subjectPeriod.marks]);

  const status = getStatus(average, user.settings.target);

  return {
    average,
    status,
    color: colors[status] || colors.nothing,
  };
}
