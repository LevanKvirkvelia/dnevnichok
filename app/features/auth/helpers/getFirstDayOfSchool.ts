import { SDate } from './SDate';


export function getFirstDayOfSchool(): SDate {
  const date = new Date();
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();
  const isFirstHalf = currentMonth >= 8;
  const startYear = isFirstHalf ? currentYear : currentYear - 1;
  return new SDate(`09-01-${startYear}`);
}
