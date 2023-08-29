import {Day} from '../../MarkHolder/Day';
import {SDate} from '../../../helpers/SDate';
import { any } from "../../../helpers/any";
import { delay } from '../../../helpers/delay';
import { timeout } from '../../../helpers/timeout';
import {Req} from '../../../helpers/Req';
import {IDiaryStudent, IMinimumDiaryParser} from '../globalTypes';
import {API} from './Api';
import {Transformer} from './Transformer';

import {AxiosResponse} from 'axios';

const cheerio = require('cheerio-without-node-native');

export type SessionProperties = Partial<{
  pid: string;
  token: string;
  authData: {login: string; password?: string; engine: 'MOS.RU'};
  csrf: string;
  relogin: boolean;
  loginPromise: Promise<boolean>;
}>;

export class Mosru implements IMinimumDiaryParser {
  session: SessionProperties = {};

  allowLogin: boolean = true;

  async newSession() {
    this.session = {};
  }

  constructor() {
    this.newSession();
  }

  private async _handleError(message: any, method: any) {
    if (
      this.session.authData.password &&
      message ==
        'Предыдущая сессия работы в ЭЖД завершена. Войдите в ЭЖД заново' &&
      !this.session.relogin
    ) {
      this.session.relogin = true;
      await this.login(this.session.authData);
      // Повторно вызываем нужный нам метод
      const methodResult = await method();
      this.session.relogin = false;
      return methodResult;
    } else {
      this.session.relogin = false;
      throw new Error(message);
    }
  }

  transformNumber(login: string) {
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

  async login(authData: IAuthData) {
    let login = this.transformNumber(authData.login);
    let password = authData.password;
    this.session.authData = {login, password, engine: 'MOS.RU'};

    if (authData.token && authData.pid) {
      this.setToken(authData.token, authData.pid);
      return true;
    } else if (authData.token) {
      await this.validateToken(authData.token);
      return true;
    }

    return this._login(login, password);
  }

  setToken(token: string, pid: number | string) {
    this.session.token = token;
    this.session.pid = pid.toString();
    this.resolveAuthed();
  }

  async getMobileDaysWithDay(
    userData: IDiaryStudent,
    sDate: SDate,
  ): Promise<Day[]> {
    await this.onAuthed;
    const diary = await API.getMobileSchedule(
      this.session,
      userData.profileId,
      sDate.yyyymmdd(),
    );
    if (diary.message)
      return await this._handleError(diary.message, () =>
        this.getMobileDaysWithDay(userData, sDate),
      );
    const ddmmyyyy = sDate.ddmmyyyy();
    const day = new Day(ddmmyyyy);

    const lessons = diary.activities.filter(
      (item: any) => item.type === 'LESSON',
    );

    await Promise.all(
      lessons.map(async (item: any) => {
        const attachments: any[] = [];
        if (item.lesson.link_types.length > 0) {
          const itemId = item.lesson.schedule_item_id;
          const allData = await API.getMobileLessonInfo(
            this.session,
            userData.profileId,
            itemId,
          );
          if (allData.details) item.lesson.topic = allData.details.lesson_topic;
          if (allData.additional_materials)
            allData.additional_materials.map((v: any) =>
              v.items.map((h: any) =>
                attachments.push({title: h.title, link: h.link}),
              ),
            );
        }
        const homework = {text: item.lesson.homework, attachments};
        const {last_name, first_name, middle_name} = item.lesson.teacher;
        const teacher = [last_name, first_name, middle_name]
          .filter(v => !!v)
          .join(' ');

        const marks = item.lesson.marks.map((mark: any) =>
          Transformer.mobileMark(item.lesson.subject_name, ddmmyyyy, mark),
        );

        const place = item.room_number;

        if (item.info)
          day.addLesson(
            Transformer.mobileDataToLesson(
              item,
              homework,
              teacher,
              marks,
              ddmmyyyy,
              place,
            ),
          );
      }),
    );
    return [day];
  }

  async getWebDaysWithDay(
    userData: IDiaryStudent,
    sDate: SDate,
  ): Promise<Day[]> {
    await this.onAuthed;
    const studentID = userData.id;
    const dateFrom = sDate.copy().setMonday();
    const dateTo = dateFrom.copy().setDayPlus(6);
    const groups = userData.groups.map((i: any) => i.id).join(',');

    const results = await Promise.all([
      API.getTeachers(this.session, studentID),
      API.getHomeWork(this.session, dateFrom, dateTo, studentID),
      API.getScheduleMarks(this.session, dateFrom, dateTo, studentID),
      API.getScheduleItems(this.session, dateFrom, dateTo, studentID, groups),
    ]);

    for (const response of results) {
      // @ts-ignore
      if (response.message)
        await this._handleError(response.message, () =>
          this.getWebDaysWithDay(userData, sDate),
        );
    }

    const [teachers, homework, scheduleMarks, scheduleItems] = results;
    const rooms = await API.getScheduleItemsRooms(
      this.session,
      studentID,
      scheduleItems?.map(i => i.room_id)?.join(','),
    );

    return Transformer.webDataToDays(
      this.session,
      studentID,
      teachers,
      homework,
      scheduleMarks,
      scheduleItems,
      rooms,
    );
  }

  async getDaysWithDay(userData: any, sDate: SDate): Promise<Day[]> {
    const web = this.getWebDaysWithDay(userData, sDate);
    try {
      return await timeout(web, 4000);
    } catch (e) {
      return await any([web, this.getMobileDaysWithDay(userData, sDate)]);
    }
  }

  async getWebStudents(): Promise<IDiaryStudent[]> {
    const students = await API.getWebStudents(this.session);

    if (
      students === null ||
      (typeof students === 'string' &&
        (students as string).includes('500 Internal Server'))
    )
      return await this.validateToken(this.session.token, () =>
        this.getWebStudents(),
      );
    // @ts-ignore
    if (students?.message)
      return await this._handleError(students.message, () =>
        this.getWebStudents(),
      );

    return Promise.all(
      students.map(async (s: any) => {
        const school = await API.getSchoolById(this.session, s.school_id);
        return Transformer.webStudent(s, school);
      }),
    );
  }

  async getMobileStudents(): Promise<IDiaryStudent[]> {
    let students = await API.getMobileStudents(this.session);
    // @ts-ignore
    if (students.message)
      return await this._handleError(students.message, () =>
        this.getStudents(),
      );
    return students.children.map((s: any) => Transformer.mobileStudent(s));
  }

  async getStudents(): Promise<IDiaryStudent[]> {
    await this.onAuthed;
    const students = await this.getWebStudents();
    try {
      const mobile = await this.getMobileStudents();
      return students.map((s: any) => ({
        ...mobile.find((_s: any) => s.profileId === _s.profileId),
        ...s,
      }));
    } catch (e) {}
    return students;
  }

  async getLenPeriods(user: any) {
    return (await this.getPeriodsWith(user)).length;
  }

  async getAllPeriods(userData: any) {
    return this.getPeriodsWith(userData, 1);
  }

  async getPeriodsWith(userData: any, period: string | number = 1) {
    await this.onAuthed;

    const marks = await API.getMarks(this.session, userData.profileId);
    // @ts-ignore
    if (marks.message)
      return await this._handleError(marks.message, () =>
        this.getPeriodsWith(userData, period),
      );

    return Transformer.periodsWith(marks);
  }

  async _login(login: string, password: string) {
    if (!this.session.loginPromise) {
      this.newSession();
      this.session.authData = {login, password, engine: 'MOS.RU'};
      this.session.loginPromise = this.__login(login, password);
      this.session.loginPromise.finally(
        () => (this.session.loginPromise = null),
      );
    }
    return await this.session.loginPromise;
  }

  async validateToken(token: string, method?: any) {
    const data = await Req.post('https://dnevnik.mos.ru/lms/api/sessions', {
      auth_token: token || this.session.token,
    });
    if (method) return await this._handleError(data.description, method);
    this.session.pid = data.profiles[0].id;
    this.session.token = data.authentication_token;
    this.resolveAuthed();
  }

  async getToken(url: string) {
    const code = url.split('code=')[1];
    this.resolveAuthed();
    const session = await Req.get(
      `https://school.mos.ru/v1/sudir/main/callback?code=${code}`,
    );
    if (!session.userId) throw new Error('Error at get token');
    const userId = session.userId;

    const token = await Req.get(
      `https://school.mos.ru/v2/token/refresh?roleId=${session.roles?.[0]?.id}&subsystem=2`,
      {},
      {},
      'text',
    );
    await Req.get(
      `https://dnevnik.mos.ru/aupd/auth`,
      {},
      {Cookie: `;aupd_token=${token};obr_id=${userId};`},
      'text',
    );

    await this.validateToken(token);

    return true;
  }

  async checkResponse(d2: AxiosResponse) {
    const url = d2.request.responseURL || d2.config.url;
    if (url?.includes('code=')) {
      return this.getToken(url);
    } else if (d2.data.indexOf('Ошибка доступа') + 1)
      throw new Error(
        'Ошибка доступа. Зайдите с компьютера на MOS.ru и исправьте ошибку',
      );
    else if (d2.data.indexOf('Необходимо задать новый пароль') + 1)
      throw new Error('Ваш пароль устарел. Необходимо задать новый');
    else if (d2.data.indexOf('некорректный логин или пароль') + 1)
      throw new Error('Неправильный логин или пароль');
    else if (d2.data.indexOf('какой-то причине мы') + 1) await delay(200);
  }

  async __login(login: string, password: string, retry = 2): Promise<boolean> {
    return false;
  }

  async getAccountId() {
    await this.onAuthed;
    if (!this.session.pid)
      throw new Error(
        'Ошибка получения ID пользователя. Попробуйте авторизоваться снова.',
      );
    return this.session.pid;
  }

  async getAttendance(student: any) {
    const from = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    const to = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    let visits = await Req.get(
      'https://dnevnik.mos.ru/mobile/api/v1.0/visits',
      {contract_id: student.contract_id, from, to},
      {'auth-token': this.session.token, 'profile-id': this.session.pid},
    );
    if (visits.message)
      return await this._handleError(visits.message, () =>
        this.getAttendance(student),
      );

    let attendance = await Req.get(
      'https://dnevnik.mos.ru/mobile/api/v1.0/attendance',
      {student_id: student.profileId},
      {'auth-token': this.session.token, 'profile-id': this.session.pid},
    );
    if (attendance.message)
      return await this._handleError(attendance.message, () =>
        this.getAttendance(student),
      );

    visits = visits.payload;
    visits.sort((a: any, b: any) => {
      return new Date(a.date).getTime() < new Date(b.date).getTime() ? 1 : -1;
    });
    return {visits, attendance: attendance.attendance};
  }

  async addAttendanceNotifications(student: any, days: string[]) {
    let attendance = await Req.post(
      'https://dnevnik.mos.ru/mobile/api/v1.0/attendance',
      {
        student_id: student.profileId,
        notifications: days.map(date => ({date, reason_id: 4})),
      },
      {'auth-token': this.session.token, 'profile-id': this.session.pid},
    );
    if (attendance.message)
      return await this._handleError(attendance.message, () =>
        this.addAttendanceNotifications(student, days),
      );
    attendance = attendance.ids;
    return attendance;
  }

  async deleteAttendanceNotifications(student: any, days: string[]) {
    let attendance = await Req.post(
      'https://dnevnik.mos.ru/mobile/api/v1.0/attendance',
      {
        student_id: student.profileId,
        notifications: days.map(date => ({date})),
      },
      {
        'auth-token': this.session.token,
        'profile-id': this.session.pid,
        method: 'DELETE',
      },
      'json',
      'json',
    );
    if (attendance.status === 204) return;
    else attendance = JSON.parse(attendance.body);
    if (attendance.message)
      return await this._handleError(attendance.message, () =>
        this.deleteAttendanceNotifications(student, days),
      );
    return;
  }

  async getBilling(student: any) {
    const from = new Date(Date.now() - 62 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    const to = new Date(Date.now() + 62 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    let billing = await Req.get(
      'https://dnevnik.mos.ru/mobile/api/v1.0/billing',
      {contract_id: student.contract_id, from, to},
      {'auth-token': this.session.token, 'profile-id': this.session.pid},
    );
    if (billing.message)
      return await this._handleError(billing.message, () =>
        this.getBilling(student),
      );
    billing.payload.sort((a: any, b: any) => {
      return new Date(a.date).getTime() < new Date(b.date).getTime() ? 1 : -1;
    });
    return billing;
  }

  async getBalances(students: any) {
    let contract_ids = students
      .map((student: any) => student.contract_id)
      .join(',');
    let data = await Req.get(
      `https://dnevnik.mos.ru/mobile/api/v1.0/status?contract_ids=${contract_ids}`,
      {},
      {'auth-token': this.session.token, 'profile-id': this.session.pid},
    );
    return data.students;
  }

  async setLinksList(homeworkId: any, attachments: any) {
    const newHomework = await API.setLinksList(
      this.session,
      homeworkId,
      attachments,
    );
    if (newHomework.message)
      return await this._handleError(newHomework.message, () =>
        this.setLinksList(homeworkId, attachments),
      );
    return {
      links: newHomework.remote_attachments,
      files: newHomework.attachments,
    };
  }

  async setAttachmentsList(homeworkId: any, attachments: any) {
    const newHomework = await API.setAttachmentsList(
      this.session,
      homeworkId,
      attachments,
    );
    if (newHomework.message)
      return await this._handleError(newHomework.message, () =>
        this.setAttachmentsList(homeworkId, attachments),
      );
    return {
      links: newHomework.remote_attachments,
      files: newHomework.attachments,
    };
  }

  async uploadFileToMos(homeworkId: string, file: unknown) {
    const files = await API.uploadFileToMos(this.session, homeworkId, file);

    if (files.message) {
      return await this._handleError(files.message, () =>
        this.uploadFileToMos(homeworkId, file),
      );
    }

    const fileData = files && files[0];

    return fileData
      ? {...fileData, file_file_name: fileData.title, path: fileData.link}
      : null;
  }

  meshLink(userId: any) {
    const link = `https://uchebnik.mos.ru/authenticate?authToken=${this.session.token}&profileId=${this.session.pid}&userId=${userId}&referer=homework&backurl=https://uchebnik.mos.ru`;
    return link;
  }

  async getAccountMeta() {
    return undefined;
  }

  async getChats() {
    return API.getChats(this.session);
  }

  validatePassword(password: string) {
    const regExp = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
    );

    if (!regExp.test(password)) {
      throw new Error('Пароль не соответствует требованиям безопасности');
    }
  }

  changeStudentPassword = async (userId: string | number, password: string) => {
    this.validatePassword(password);

    const errorMessage = 'Произошла ошибка при смене пароля';

    const refresh = await API.refreshToken(this.session);

    if (!refresh) throw new Error(errorMessage);
    if (refresh.message) throw new Error(refresh.message);

    const result = await API.changeStudentPassword(
      this.session,
      userId,
      password,
    );

    if (!result) throw new Error(errorMessage);
    if (result.message) throw new Error(result.message);

    return true;
  };

  createStudentAccount = async (
    userId: string | number,
    data: {
      FirstName: string;
      LastName: string;
      login: string;
      password: string;
    },
  ) => {
    this.validatePassword(data.password);

    const errorMessage = 'Произошла ошибка при создании аккаунта';

    const refresh = await API.refreshToken(this.session);

    if (!refresh) throw new Error(errorMessage);
    if (refresh.message) throw new Error(refresh.message);

    const result = await API.createStudentAccount(this.session, userId, data);

    if (!result) throw new Error(errorMessage);
    if (result.errors) {
      const error = result.errors.map(e => e.errMsg).join('\n');
      throw new Error(error || errorMessage);
    }

    return true;
  };

  getStudentInfo = async (userId: string | number) => {
    let login: string;
    let accountType: 'no' | 'dnevnik' | 'mosru' = 'no';

    const [{value}, hasMosruAccount] = await Promise.all([
      API.getExistingLogin(this.session, userId)
        .then(res => (res == null ? {value: undefined} : res))
        .catch(() => ({value: undefined})),
      API.hasMosruAccount(userId).catch(() => false),
    ]);

    if (value) {
      accountType = 'dnevnik';
    }

    if (hasMosruAccount) {
      accountType = 'mosru';
    }

    login = value;

    if (!login) {
      const res = await API.generateLogin(this.session, userId).catch(() => ({
        value: undefined,
      }));
      login = res?.value;
    }

    return {login, accountType};
  };
}
