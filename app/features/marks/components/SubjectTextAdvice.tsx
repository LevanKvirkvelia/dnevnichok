import React from 'react';
import Color from 'color';
import {Text} from 'react-native';
import {declOfNum} from '../../../shared/helpers/declOfNum';
import {useActiveUser} from '../../auth/hooks/useActiveUser';
import {IMark, ISubjectPeriod} from '../../parsers/data/types';
import {useTheme} from '../../themes/useTheme';
import {isInt} from '../utils';

function calculateMarksNeeded(marks?: IMark[], target: number = 5) {
  const marksCopy = [...(marks || [])];
  const adjustedTarget = target - 0.35;
  let totalValue = 0;
  let totalWeight = 0;

  marksCopy.forEach(mark => {
    if (!mark.value || !isInt(mark.value)) return;

    totalValue += +mark.value * mark.weight;
    totalWeight += mark.weight;
  });

  if (!totalWeight) return 1;
  if (adjustedTarget <= totalValue / totalWeight) return 0;

  const requiredMarks = Math.ceil((totalWeight * adjustedTarget - totalValue) / (5 - adjustedTarget));

  return Math.max(0, Math.min(requiredMarks, 20));
}

export function SubjectTextAdvice({subjectPeriod}: {subjectPeriod: ISubjectPeriod}) {
  const {colors} = useTheme();
  const user = useActiveUser();

  if (!user) return null;

  const marksNeeded = calculateMarksNeeded(subjectPeriod.marks, user.settings.target);
  const text =
    marksNeeded > 0
      ? `До цели ${marksNeeded} ${declOfNum(marksNeeded, ['пятерка', 'пятерки', 'пятерок'])}`
      : `Цель достигнута`;

  if (!text) return null;
  return <Text style={{color: Color(colors.textOnRow).alpha(0.5).rgb().toString()}}>{text}</Text>;
}
