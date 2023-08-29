import {SDate} from '../../helpers/SDate';
import {createParser} from './CreateParser';
import {Req} from '../../helpers/Req';
import {ParsedUser, User} from '../../state/useUsersStore';

import {stringMd5} from 'react-native-quick-md5';
const cheerio = require('cheerio-without-node-native');

import {IDaySchedule, IMark, IPeriod} from '../data/types';
import {
  DayScheduleConstructor,
  PeriodConstructor,
} from '../data/constructors';

async function login(login: string, password: string) {
  let logon = await Req.post(
    'https://edu.tatar.ru/logon',
    {
      main_login: login,
      main_password: password,
    },
    {
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      Referer: 'https://edu.tatar.ru/logon',
      Origin: 'https://edu.tatar.ru',
    },
    'form',
    'all',
  );
  if (logon.data.indexOf('Моя анкета') + 1) {
    return true;
  } else throw new Error('Неправильный логин или пароль');
}

async function getDaysWithDay(
  user: User,
  sDate: SDate,
): Promise<IDaySchedule[]> {
  const date = new SDate(sDate);
  let data = await Req.get(
    'https://edu.tatar.ru/user/diary/day',
    {
      for: Math.floor(date.date.getTime() / 1000),
    },
    {
      Referer: 'https://edu.tatar.ru/logon',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    'text',
  );
  const day = new DayScheduleConstructor(date.ddmmyyyy());
  const $ = cheerio.load(data.trim());

  $('tbody>tr').map((index: number, element: any) => {
    let lesson = $(element);
    lesson = lesson.children('td');

    let marks: IMark[] = [];
    $(lesson[4])
      .children()
      .first()
      .children()
      .first()
      .children()
      .map((index: number, element: any) => {
        let mark = $(element);
        marks.push({
          date: date.ddmmyyyy(),
          value: mark.children().first().text(),
          weight: 1,
          name: mark.attr('title'),
        });
      });
    lesson = lesson.map((i: number, e: any) => {
      return $(e).text().trim();
    });
    day.upsertLessonData({
      id: stringMd5(lesson[1]),
      number: index + 1,
      name: lesson[1],
      date: date.ddmmyyyy(),
      homework: {
        text: lesson[2],
        attachments: [],
      },
      marks,
      comment: lesson[3],
      teacher: {
        id: stringMd5(`${user.parsedData.classId} ${lesson[1]}`),
      },
    });
  });
  return [day.toDaySchedule()];
}

async function getStudents(): Promise<ParsedUser[]> {
  let data = await Req.get(
    'https://edu.tatar.ru/user/anketa/index',
    {},
    {},
    'text',
  );
  let diary = await Req.get(
    'https://edu.tatar.ru/user/diary/week',
    {},
    {},
    'text',
  );
  const $anketa = cheerio.load(data.trim());
  let name = $anketa($anketa('.tableEx tr td')[1]).text();
  let profileId = $anketa($anketa('.tableEx tr td')[3]).text();
  let schoolName = $anketa($anketa('.tableEx tr td')[5]).text();

  const $diary = cheerio.load(diary.trim());
  let className = $diary('.top-panel-user span')
    .text()
    .split(',')[1]
    .split(' ')[0]
    .trim();

  return [
    {
      id: profileId,
      name: name,
      parsedData: {
        schoolId: stringMd5(schoolName),
        classId: stringMd5(className),
        schoolName,
        className,
      },
      engine: 'edu.tatar.ru',
    },
  ];
}

async function getPeriodsWith(periodNumber: number) {
  let terms = await Req.post(
    'https://edu.tatar.ru/user/diary/term',
    {term: periodNumber},
    {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    'form',
    'text',
  );
  const $ = cheerio.load(terms.trim());
  const period = new PeriodConstructor(periodNumber);

  $('tbody tr').each((i: number, tableRowEl: any) => {
    const tableRow = $(tableRowEl);
    const cells = tableRow.children();

    const lessonName = $(cells[0]).text();
    const lessonID = stringMd5(lessonName);

    if (lessonName === 'ИТОГО') return;

    period.upsertLessonData({name: lessonName, id: lessonID});

    const length = cells.length;
    cells.each((index: number, cellEl: any) => {
      const value = $(cellEl).text();

      if (index > 0 && index < length - 3 && value) {
        period.addMark(lessonID, {value, weight: 1, name: ''});
      }
    });
  });
  return [period.toPeriod()];
}

export const eduTatarParser = createParser({
  auth: {
    login: {
      cacheTime: 0,
      staleTime: 0,
      async queryFn({queryKey}) {
        const [{authData, sessionData}] = queryKey;
        if (!authData.login || !authData.password) {
          throw new Error('Неправильный логин или пароль');
        }

        return login(authData.login, authData.password);
      },
    },

    backgroundLogin: {
      cacheTime: 0,
      staleTime: 0,
      async queryFn({queryKey}) {
        const [{account}] = queryKey;
        return eduTatarParser.auth.login!({
          authData: account.authData,
          sessionData: account.sessionData,
        });
      },
    },

    getStudents: {
      cacheTime: 0,
      staleTime: 0,
      async queryFn() {
        return getStudents();
      },
    },

    getAccountId: {
      cacheTime: 0,
      staleTime: 0,
      async queryFn({queryKey}) {
        const [{account}] = queryKey;
        return account.engine + ':' + account.authData.login.toLowerCase();
      },
    },
  },
  periods: {
    getLenPeriods: {
      cacheTime: 0,
      staleTime: 0,
      async queryFn(): Promise<number> {
        const terms = await Req.post(
          'https://edu.tatar.ru/user/diary/term?term=1',
          {},
          {
            Accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          'form',
          'text',
        );
        const $ = cheerio.load(terms.trim());
        return $('#term').children().length - 1;
      },
    },
    getPeriodsWith: {
      async queryFn({queryKey}) {
        const [{period}] = queryKey;
        return getPeriodsWith(period as number);
      },
    },
    getAllPeriods: {
      async queryFn({queryKey}) {
        const {account, user} = queryKey[0];
        const lenPeriods = await eduTatarParser.periods.getLenPeriods({
          account,
          user,
        });

        const response = await Promise.all(
          Array(lenPeriods)
            .fill(null)
            .map(async (u, i: number) =>
              eduTatarParser.periods.getPeriodsWith({
                period: i,
                account,
                user,
              }),
            ),
        );

        return response.flat();
      },
    },
  },
  diary: {
    getDaysWithDay: {
      async queryFn({queryKey}) {
        const [{user, sDate}] = queryKey;
        return getDaysWithDay(user, sDate);
      },
    },
  },
});
