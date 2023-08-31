import {stringMd5} from 'react-native-quick-md5';

import {API} from './Api';
import {Transformer} from './Transformer';
import {createParser} from '../../createParser';
import {UserInfo} from './types';
import {Req} from '../../../auth/helpers/Req';
import {SDate} from '../../../auth/helpers/SDate';
import {any} from '../../../auth/helpers/any';
import {timeout} from '../../../auth/helpers/timeout';
import {Account, SessionData, ParsedUser, User} from '../../../auth/state/useUsersStore';
import {DayScheduleConstructor} from '../../data/constructors';
import {IDaySchedule, IMark, IPeriod} from '../../data/types';

async function getMobileDaysWithDay(account: Account, user: User, sDate: SDate): Promise<IDaySchedule[]> {
  const diary = await API.getMobileSchedule(account.sessionData!, user.id, sDate.yyyymmdd());
  if (diary.message) throw new Error(diary.message);

  const ddmmyyyy = sDate.ddmmyyyy();
  const day = new DayScheduleConstructor(ddmmyyyy);

  const lessons = diary.activities.filter((item: any) => item.type === 'LESSON');

  await Promise.all(
    lessons.map(async (item: any) => {
      const attachments: any[] = [];
      if (item.lesson.link_types.length > 0) {
        const itemId = item.lesson.schedule_item_id;
        const allData = await API.getMobileLessonInfo(account.sessionData!, user.id, itemId);
        if (allData.details) item.lesson.topic = allData.details.lesson_topic;
        if (allData.additional_materials)
          allData.additional_materials.map((v: any) =>
            v.items.map((h: any) => attachments.push({title: h.title, link: h.link})),
          );
      }
      const homework = {text: item.lesson.homework, attachments};
      const {last_name, first_name, middle_name} = item.lesson.teacher;
      const teacher = [last_name, first_name, middle_name].filter(v => !!v).join(' ');

      const marks: IMark[] = item.lesson.marks.map(
        (mark: any): IMark => ({
          date: ddmmyyyy,
          subjectName: item.lesson.subject_name,
          value: mark.value,
          weight: mark.weight,
          point: mark.is_point,
        }),
      );

      const place = item.room_number;

      if (item.info) {
        const types: any = {
          THEMATIC_TEST: 'Тематический тест',
          CONTROL_WORK: 'Контрольная работа',
        };
        const lessonType = types[item.lesson.course_lesson_type] || null;

        day.upsertLessonData({
          id: stringMd5(item.lesson.subject_name),
          extras: {realId: item.lesson.scheduled_lesson_id},
          lessonType,
          missed: item.lesson.is_missed_lesson,
          theme: item.lesson.topic,
          name: item.lesson.subject_name,
          date: ddmmyyyy,
          number: +item.info.split(' ')[0],
          teacher: {
            name: teacher,
            id: teacher,
          },
          homework,
          location: place,
          time: {start: item.begin_time, end: item.end_time},
          marks,
        });
      }
    }),
  );
  return [day.toDaySchedule()];
}

async function getWebDaysWithDay(account: Account, user: User, sDate: SDate): Promise<IDaySchedule[]> {
  const studentID = user.id;
  const dateFrom = sDate.copy().setMonday();
  const dateTo = dateFrom.copy().setDayPlus(6);
  const groups = user.engineUserData.groups.map((i: any) => i.id).join(',');

  const results = await Promise.all([
    API.getTeachers(account.sessionData!, studentID),
    API.getHomeWork(account.sessionData!, dateFrom, dateTo, studentID),
    API.getScheduleMarks(account.sessionData!, dateFrom, dateTo, studentID),
    API.getScheduleItems(account.sessionData!, dateFrom, dateTo, studentID, groups),
  ]);

  for (const response of results) {
    // @ts-ignore
    if (response.message)
      // @ts-ignore
      throw new Error(response.message || 'Ошибка получения данных');
  }

  const [teachers, homework, scheduleMarks, scheduleItems] = results;
  const rooms = await API.getScheduleItemsRooms(
    account.sessionData!,
    studentID,
    scheduleItems?.map(i => i.room_id)?.join(','),
  );

  return Transformer.webDataToDays(
    account.sessionData!,
    studentID,
    teachers,
    homework,
    scheduleMarks,
    scheduleItems,
    rooms,
  );
}

async function getDaysWithDay(account: Account, user: User, sDate: SDate): Promise<IDaySchedule[]> {
  const web = getWebDaysWithDay(account, user, sDate);
  try {
    return await timeout(web, 4000);
  } catch (e) {
    return await any([web, getMobileDaysWithDay(account, user, sDate)]);
  }
}

async function getWebStudents(sessionData: SessionData): Promise<ParsedUser[]> {
  const students = await API.getWebStudents(sessionData);

  // if (
  //   students === null ||
  //   (typeof students === 'string' &&
  //     (students as string).includes('500 Internal Server'))
  // )
  //   return await this.validateToken(this.session.token, () =>
  //     this.getWebStudents(),
  //   );
  // @ts-ignore
  if (students?.message)
    // @ts-ignore
    throw new Error(students?.message);

  return Promise.all(
    students.map(async s => {
      const school = await API.getSchoolById(sessionData, s.school_id);
      return Transformer.createStudent(s, school);
    }),
  );
}

async function getMobileStudents(sessionData: SessionData): Promise<ParsedUser[]> {
  let students = await API.getMobileStudents(sessionData);
  // @ts-ignore
  if (students?.message)
    // @ts-ignore
    throw new Error(students?.message);

  return students.children.map(s => Transformer.createStudent(s));
}

async function getStudents(sessionData: SessionData): Promise<ParsedUser[]> {
  const students = await getWebStudents(sessionData);
  try {
    const mobile = await getMobileStudents(sessionData);
    return students.map((s: any) => ({
      ...mobile.find((_s: any) => s.profileId === _s.profileId),
      ...s,
    }));
  } catch (e) {}
  return students;
}

async function getPeriodsWith(account: Account, user: User, period: string | number = 1): Promise<IPeriod[]> {
  const marks = await API.getMarks(account.sessionData!, user.id);

  // @ts-ignore
  if (marks.message) throw new Error(marks.message);

  return Transformer.periodsWith(marks);
}

async function _handleError(message: any, method: any) {
  // if (
  //   this.session.authData.password &&
  //   message == 'Предыдущая сессия работы в ЭЖД завершена. Войдите в ЭЖД заново' &&
  //   !this.session.relogin
  // )
}

function transformNumber(login: string) {
  login = login.trim();
  if (login.indexOf('7') === 0 && login.match(/[a-zа-я]/gi) === null) {
    login = '+' + login;
  }
  if (login.indexOf('8') === 0 && login.match(/[a-zа-я]/gi) === null) {
    let n = login.split('');
    n[0] = '7';
    login = '+' + n.join('');
  }
  login = login.toLowerCase();
  return login;
}

async function validateToken(token: string) {
  const data = await Req.post('https://dnevnik.mos.ru/lms/api/sessions', {
    auth_token: token,
  });

  if (data.description) throw new Error(data.description);

  return {
    pid: data.profiles[0].id,
    token: data.authentication_token,
  };
}

export async function getToken(url: string) {
  const code = url.split('code=')[1];
  await Req.get(`https://school.mos.ru/v3/auth/sudir/callback?code=${code}`, {}, {});
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
  await Req.get(`https://dnevnik.mos.ru/aupd/auth`, {}, {Cookie: `;aupd_token=${token};obr_id=${userId};`}, 'text');

  return validateToken(token);
}
export const mosruParser = createParser({
  auth: {
    login: null,
    backgroundLogin() {
      throw new Error('Error at backgroundLogin');
    },
    getStudents({sessionData}) {
      return getStudents(sessionData!);
    },
    getAccountId({sessionData}) {
      if (!sessionData?.pid) throw new Error('No pid');
      return sessionData?.pid;
    },
  },
  periods: {
    async getPeriodsLenQuick({account, user}) {
      return (await getPeriodsWith(account, user)).length;
    },
    getAllPeriodsQuick({account, user}) {
      return getPeriodsWith(account, user);
    },
    getPeriodsWith({account, user, period}) {
      return getPeriodsWith(account, user, period);
    },
  },
  diary: {
    getDaysWithDay({account, user, sDate}) {
      return getDaysWithDay(account, user, sDate);
    },
  },
});
