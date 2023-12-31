import {stringMd5} from 'react-native-quick-md5';
import {Req} from '../../auth/helpers/Req';
import {SDate} from '../../auth/helpers/SDate';
import {SessionData, User, ParsedUser, Account} from '../../auth/state/useUsersStore';
import {createParser} from '../createParser';
import {DayScheduleConstructor, PeriodConstructor} from '../data/constructors';
import {IDaySchedule, IMark} from '../data/types';
const cheerio = require('cheerio-without-node-native');

async function login(login: string, password: string): Promise<Pick<Account, 'sessionData' | 'engineAccountData'>> {
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
    return {
      sessionData: {},
      engineAccountData: {},
    };
  } else throw new Error('Неправильный логин или пароль');
}

async function getDaysWithDay(user: User, sDate: SDate): Promise<IDaySchedule[]> {
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
      numberFrom1: index + 1,
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
  const data = await Req.get('https://edu.tatar.ru/user/anketa/index', {}, {}, 'text');
  const diary = await Req.get('https://edu.tatar.ru/user/diary/week', {}, {}, 'text');

  const $anketa = cheerio.load(data.trim());
  const $diary = cheerio.load(diary.trim());

  const name = $anketa($anketa('.tableEx tr td')[1]).text();
  const profileId = $anketa($anketa('.tableEx tr td')[3]).text();
  const schoolName = $anketa($anketa('.tableEx tr td')[5]).text();
  const className = $diary('.top-panel-user span').text().split(',')[1].split(' ')[0].trim();

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
  const terms = await Req.post(
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

    cells.slice(1, -3).each((index: number, cellEl: any) => {
      const value = $(cellEl).text();
      if (value) period.addMark(lessonID, {value, weight: 1});
    });
  });

  return [period.toPeriod()];
}

// TODO check staleTime and cacheTime
export const eduTatarParser = createParser({
  auth: {
    async login({authData}) {
      if (!authData.login || !authData.password) {
        throw new Error('Неправильный логин или пароль');
      }

      return login(authData.login, authData.password);
    },

    async backgroundLogin({authData, sessionData}) {
      return eduTatarParser.auth.login!({authData, sessionData});
    },

    async getStudents() {
      return getStudents();
    },

    async getAccountId({authData}) {
      return 'EduTatarRu:' + authData.login.toLowerCase();
    },
  },
  periods: {
    async getPeriodsLenQuick() {
      const terms = await Req.post(
        'https://edu.tatar.ru/user/diary/term?term=1',
        {},
        {
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        'form',
        'text',
      );
      const $ = cheerio.load(terms.trim());
      return $('#term').children().length - 1;
    },
    async getPeriodsWith({period}) {
      return getPeriodsWith(period as number);
    },
    getAllPeriodsQuick: null,
  },
  diary: {
    async getDaysWithDay({user, sDate}) {
      return getDaysWithDay(user, sDate);
    },
  },
});
