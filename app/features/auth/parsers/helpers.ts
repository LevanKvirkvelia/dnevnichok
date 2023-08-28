import {SDate} from './SDate';

export function parsePhone(phone: any) {
  let phoneParsed = '+7';
  if (phone.slice(0, 2) === '+7')
    phoneParsed = phoneParsed + `(${phone.slice(2, 5)})${phone.slice(5, 12)}`;
  else if (phone.slice(0, 1) === '8' || phone.slice(0, 1) === '7')
    phoneParsed = phoneParsed + `(${phone.slice(1, 4)})${phone.slice(4, 11)}`;
  else
    phoneParsed = phoneParsed + `(${phone.slice(0, 3)})${phone.slice(3, 10)}`;
  return phoneParsed;
}

export function hash(str: string) {
  str = (str || '').toString();
  let hash = 5381,
    i = str.length;
  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return (hash >>> 0).toString();
}

export function timeout<R, P extends Promise<R>>(
  promise: P,
  ms: number,
): Promise<R> {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error('timeout'));
    }, ms);
    promise.then(resolve, reject);
  });
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getFirstDayOfSchool(): SDate {
  const date = new Date();
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();
  const isFirstHalf = currentMonth >= 8;
  const startYear = isFirstHalf ? currentYear : currentYear - 1;
  return new SDate(`09-01-${startYear}`);
}
