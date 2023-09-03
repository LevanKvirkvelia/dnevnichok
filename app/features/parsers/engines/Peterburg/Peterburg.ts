import {Req} from '../../../auth/helpers/Req';
import {SDate} from '../../../auth/helpers/SDate';
import {SessionData, ParsedUser, Account, User} from '../../../auth/state/useUsersStore';
import {createParser} from '../../createParser';
import {PeriodConstructor, DayScheduleConstructor} from '../../data/constructors';
import {IDaySchedule} from '../../data/types';
import {
  APIGroupGroupGetListPeriod,
  APIJournalEstimateTable,
  APIJournalLessonListByEducation,
  APIJournalPersonRelatedChildList,
  APIJournalScheduleListByEducation,
  APIUserAuthLogin,
  IndigoItem,
  TentacledItem,
} from './types';
import {stringMd5} from 'react-native-quick-md5';

async function login(login: string, password: string): Promise<Pick<Account, 'sessionData' | 'engineAccountData'>> {
  const logon: APIUserAuthLogin = await Req.post(
    'https://dnevnik2.petersburgedu.ru/api/user/auth/login',
    {
      login: login,
      password: password,
      type: 'email',
      _isEmpty: false,
      activation_code: null,
    },
    {
      Accept: 'application/json, text/plain, */*',
      Referer: 'https://dnevnik2.petersburgedu.ru/login',
      'X-Requested-With': 'XMLHttpRequest',
    },
    'json',
    'json',
  );

  if (logon.data && typeof logon.data.token == 'string') {
    return {
      sessionData: logon.data,
      engineAccountData: {},
    };
  }

  throw new Error(logon?.validations[0]?.message || 'Неправильный логин или пароль');
}

async function getStudents(sessionData: SessionData): Promise<ParsedUser[]> {
  const response = await Req.get(
    'https://dnevnik2.petersburgedu.ru/api/journal/person/related-child-list',
    {},
    {
      'X-JWT-Token': sessionData?.token,
    },
    'all',
  );

  if ([401, 403].includes(response.status)) {
    throw new Error('Ошибка доступа');
  }

  const childList: APIJournalPersonRelatedChildList = response.data;

  return childList.data.items.map((student: any) => ({
    id: student.identity.id,
    engine: 'Петербургское образование',
    name: `${student.surname} ${student.firstname}`,
    parsedData: {
      schoolId: student.educations[0].institution_id,
      classId: String(student.educations[0].group_id),
      schoolName: student.educations[0].institution_name,
      className: student.educations[0].group_name,
    },
    engineUserData: {
      educationId: student.educations[0].education_id,
    },
  }));
}

async function getListPeriod(account: Account, user: User) {
  const response: APIGroupGroupGetListPeriod = await Req.get(
    'https://dnevnik2.petersburgedu.ru/api/group/group/get-list-period',
    {
      'p_group_ids[]': user.parsedData.classId,
      p_limit: 20,
      p_page: 1,
    },
    {'X-JWT-Token': account.sessionData?.token},
  );
  return response.data.items;
}

async function getPeriodsWith(account: Account, user: User, periodNum: number) {
  const periods = await getListPeriod(account, user);
  const periodInfo = periods[periodNum - 1];

  const response: APIJournalEstimateTable = await Req.get(
    'https://dnevnik2.petersburgedu.ru/api/journal/estimate/table',
    {
      'p_educations[]': user.engineUserData.educationId,
      p_date_from: periodInfo.date_from,
      p_date_to: periodInfo.date_to,
      p_limit: 1000,
      p_page: 1,
    },
    {'X-JWT-Token': account.sessionData?.token},
  );

  const period = new PeriodConstructor(periodNum);

  response.data.items.map(mark => {
    const lessonId = stringMd5(mark.subject_name);
    period.upsertLessonData({
      id: lessonId,
      name: mark.subject_name,
    });
    if (
      mark.estimate_type_name != null &&
      (mark.estimate_type_name.indexOf('четверть') + 1 || mark.estimate_type_name.indexOf('триместр') + 1)
    ) {
      period.upsertLessonData({
        id: lessonId,
        resultMark: +mark.estimate_value_name,
      });
      return;
    }
    period.addMark(lessonId, {
      value: +mark.estimate_value_name,
      weight: 1,
      id: mark.id,
      date: mark.date,
      subjectName: mark.subject_name,
      name: mark.estimate_type_name,
    });
  });
  return [period.toPeriod()];
}

async function getDaysWithDay(account: Account, user: User, sDate: SDate): Promise<IDaySchedule[]> {
  const selectedDate = new SDate(sDate).copy();
  const response: APIJournalLessonListByEducation = await Req.get(
    'https://dnevnik2.petersburgedu.ru/api/journal/lesson/list-by-education',
    {
      p_limit: 1000,
      p_page: 1,
      p_datetime_from: selectedDate.ddmmyyyy(),
      p_datetime_to: selectedDate.ddmmyyyy(),
      'p_groups[]': user.parsedData.classId,
      'p_educations[]': user.engineUserData.educationId,
      date: selectedDate.ddmmyyyy(),
    },
    {'X-JWT-Token': account.sessionData?.token},
  );
  const schedule: APIJournalScheduleListByEducation = await Req.get(
    'https://dnevnik2.petersburgedu.ru/api/journal/schedule/list-by-education',
    {
      p_limit: 1000,
      p_page: 1,
      p_datetime_from: selectedDate.ddmmyyyy(),
      p_datetime_to: selectedDate.ddmmyyyy() + ' 23:59:59',
      'p_groups[]': user.parsedData.classId,
      'p_educations[]': user.engineUserData.educationId,
      date: selectedDate.ddmmyyyy(),
    },
    {'X-JWT-Token': account.sessionData?.token},
  );

  const lessons: {[hash: string]: TentacledItem | IndigoItem} = {};

  [...schedule.data.items, ...response.data.items].forEach(item => {
    const itemHash = [item.subject_name, item.datetime_from, item.datetime_to, item.number].join(':');
    const lesson = lessons[itemHash] || {};

    lessons[itemHash] = {...lesson, ...item};
  });

  const days = Object.values(lessons).reduce<{
    [date: string]: DayScheduleConstructor;
  }>(
    (acc, item) => {
      const date = item.datetime_from.split(' ')[0];
      if (!acc[date]) acc[date] = new DayScheduleConstructor(date);
      acc[date].upsertLessonData({
        name: item.subject_name,
        id: stringMd5(item.subject_name),
        time: {
          start: item.datetime_from.split(' ')[1].slice(0, -3),
          end: item.datetime_to.split(' ')[1].slice(0, -3),
        },
        numberFrom1: item.number,
        date: date,
        teacher: {
          id: String(item.subject_id),
        },
        homework: {
          attachments: [],
          text: ('tasks' in item && item.tasks[0] && item.tasks[0].task_name) || '',
        },
        topic: ('content_name' in item && item.content_name) || '',
        marks:
          'estimates' in item
            ? item.estimates.map(mark => ({
                id: '',
                value: +mark.estimate_value_name || 'H',
                weight: 1,
                name: mark.estimate_type_name || mark.estimate_value_name,
                date: date,
              }))
            : [],
      });

      return acc;
    },
    {
      [selectedDate.ddmmyyyy()]: new DayScheduleConstructor(selectedDate.ddmmyyyy()),
    },
  );

  return Object.values(days).map(day => day.toDaySchedule());
}
export const peterburgParser = createParser({
  auth: {
    async login({authData, sessionData}) {
      if (!authData.login || !authData.password) {
        throw new Error('Неправильный логин или пароль');
      }
      return login(authData.login, authData.password);
    },
    async backgroundLogin({authData, sessionData}) {
      return peterburgParser.auth.login!({
        authData,
        sessionData,
      });
    },
    async getStudents({sessionData}) {
      return getStudents(sessionData!);
    },
    async getAccountId({authData}) {
      return 'Peterburg:' + authData.login.toLowerCase();
    },
  },
  periods: {
    async getPeriodsLenQuick({account, user}) {
      const items = await getListPeriod(account, user);
      return items.length - 1;
    },
    async getPeriodsWith({account, user, period}) {
      return getPeriodsWith(account, user, period as number); // TODO DEFAULT PERIOD
    },
    getAllPeriodsQuick: null,
  },
  diary: {
    async getDaysWithDay({account, user, sDate}) {
      return getDaysWithDay(account, user, sDate);
    },
  },
});
