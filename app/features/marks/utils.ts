import {SDate} from '../auth/helpers/SDate';
import {PeriodDate} from './state/usePeriodsState';

export const periodVariants = [
  {key: 'automatic', name: 'Автоматически'},
  {key: 'custom', name: 'Вручную'},
] as const;

const monthsIndices = {8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 1: 5, 2: 6, 3: 7, 4: 8, 5: 9, 6: 10, 7: 11};
export function normalizeMonth(month: number) {
  if (!month || month < 1 || month > 12) throw new Error('Wrong month number');
  return monthsIndices[month as keyof typeof monthsIndices];
}
const startYear = SDate.getAcademicYearBoundaries().startDay.year();

export function periodDateToSDate(date: PeriodDate) {
  return new SDate(new Date(startYear, date.month - 1, date.day));
}

export function isInt(str: string | number) {
  if (typeof str === 'number') return Number.isInteger(str);

  const n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str;
}
