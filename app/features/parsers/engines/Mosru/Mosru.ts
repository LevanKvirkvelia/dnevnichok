import {stringMd5} from 'react-native-quick-md5';

import {API} from './Api';
import {createParser} from '../../createParser';
import {EventcalendarV1ApiEvents, LmsApiSessions, UserInfo} from './types';
import {Req} from '../../../auth/helpers/Req';
import {SDate} from '../../../auth/helpers/SDate';
import {Account, User} from '../../../auth/state/useUsersStore';
import {DayScheduleConstructor} from '../../data/constructors';
import {IDaySchedule} from '../../data/types';
import CookieManager from '@react-native-cookies/cookies';
import {Platform} from 'react-native';

async function getDaysWithDay(account: Account, user: User, sDate: SDate): Promise<IDaySchedule[]> {
  const dateFrom = sDate.copy();
  const dateTo = dateFrom.copy();

  const eventcalendar = await API.getEventcalendar(
    account,
    user.engineUserData.contingent_guid,
    dateFrom.yyyymmdd(),
    dateTo.yyyymmdd(),
  );

  // @ts-ignore
  if (eventcalendar?.message)
    // @ts-ignore
    throw new Error(eventcalendar?.message);

  const eventGroups: {[yyyymmdd: string]: EventcalendarV1ApiEvents['response'][0][]} = {};

  eventcalendar.response.forEach(event => {
    const yyyymmdd = event.start_at.split('T')[0];
    if (!eventGroups[yyyymmdd]) eventGroups[yyyymmdd] = [];
    eventGroups[yyyymmdd].push(event);
  });

  const days: {[yyyymmdd: string]: DayScheduleConstructor} = {
    [sDate.yyyymmdd()]: new DayScheduleConstructor(sDate.ddmmyyyy()),
  };

  for (const yyyymmdd in eventGroups) {
    const sdate = SDate.parseYYYYMMDD(yyyymmdd);
    if (!days[yyyymmdd]) days[yyyymmdd] = new DayScheduleConstructor(sdate.ddmmyyyy());

    eventGroups[yyyymmdd].forEach((event, numberFrom0) => {
      days[yyyymmdd].upsertLessonData({
        date: sdate.ddmmyyyy(),
        id: event.id,
        name: event.subject_name,
        numberFrom1: numberFrom0 + 1,
        location: event.room_name,
        time: {
          start: event.start_at.split('T')[1].slice(0, 5),
          end: event.finish_at.split('T')[1].slice(0, 5),
        },
        topic: event.lesson_name || undefined,
        teacher: undefined, // TODO
        homework: {
          text: event.homework?.descriptions?.join('\n'),
          attachments: [],
        },
        comment: event.comment ?? undefined,
        missed: event.is_missed_lesson,
      });
    });
  }

  return Object.values(days).map(day => day.toDaySchedule());
}

async function validateToken(token: string) {
  const data: LmsApiSessions = await Req.post('https://dnevnik.mos.ru/lms/api/sessions', {
    auth_token: token,
  });

  // @ts-ignore
  if (data.description) throw new Error(data.description);

  return {
    sessionData: {
      pid: data.profiles[0].id,
      token: data.authentication_token,
    },
    engineAccountData: data,
  };
}

export async function getToken(url: string) {
  const code = url.split('code=')[1];
  await Req.get(`https://school.mos.ru/v3/auth/sudir/callback?code=${code}`, {}, {}, 'text');
  const session: UserInfo = await Req.get(`https://school.mos.ru/v3/userinfo`, {}, {});

  // @ts-ignore
  if (session.message) throw new Error(session.message);
  if (!session.userId) throw new Error('Error at get token');

  const userId = session.userId;

  const token = await Req.get(
    `https://school.mos.ru/v2/token/refresh?roleId=${session.roles?.[0]?.id}&subsystem=2`,
    {},
    {},
    'text',
  );

  await Promise.all([
    CookieManager.setFromResponse(
      'https://school.mos.ru/v3/auth/sudir/callback',
      `aupd_token=${token}; Max-Age=86400; Expires=Tue, 05 Sep 2029 23:33:39 GMT; SameSite=None; Path=/; Domain=.mos.ru; Secure`,
    ),
  ]);

  await Req.get(
    `https://dnevnik.mos.ru/aupd/auth`,
    {},
    {
      Authorization: `Bearer ${token}`,
      Cookie: `aupd_token=${token};obr_id=${userId};`,
    },
    'text',
  );

  return validateToken(token);
}

export const mosruParser = createParser({
  auth: {
    login: null,
    backgroundLogin: null,
    async getStudents({sessionData, engineAccountData}) {
      const students = await API.getStudents({sessionData, engineAccountData});

      // @ts-ignore
      if (students?.message)
        // @ts-ignore
        throw new Error(students?.message);

      return Promise.all(
        students.children.map(async student => {
          const className = student.class_name || 'no class';
          const schoolId = student.school.id;
          const schoolName = student.school.short_name || 'no school';
          const name = [student.last_name, student.first_name].filter(v => !!v).join(' ');

          return {
            id: student.id.toString(),
            engine: 'MOS.RU',
            name: name,
            parsedData: {
              schoolId: schoolId,
              schoolName: schoolName,
              classId: stringMd5(className),
              className: className,
            },
            engineUserData: student,
          };
        }),
      );
    },
    async getAccountId({sessionData}) {
      if (!sessionData?.pid) throw new Error('No pid');
      return String(sessionData?.pid);
    },
  },
  periods: {
    getPeriodsLenQuick: null,
    async getAllPeriodsQuick({account, user}) {
      return [];
    },
    async getPeriodsWith({account, user, period}) {
      return [];
    },
  },
  diary: {
    getDaysWithDay({account, user, sDate}) {
      return getDaysWithDay(account, user, sDate);
    },
  },
});
