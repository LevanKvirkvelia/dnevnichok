import {SDate, Request, UUID} from '../..';
import {SessionProperties} from './Mosru';
import {
  CoreAPIMarks,
  CoreAPIRooms,
  CoreAPISchools,
  CoreAPIStudentHomeworks,
  CoreAPIStudentProfiles,
  CoreAPITeacherProfiles,
  JerseyAPIScheduleItems,
  MobileAPIVProfile,
  ReportsAPIProgressJSON,
} from '../../types/MOS.RU';

export class API {
  static AcademicYear = '9';

  static getTeachers(
    r: Request,
    session: SessionProperties,
    studentID: string,
  ): Promise<CoreAPITeacherProfiles[]> {
    return r.get(
      'https://dnevnik.mos.ru/core/api/teacher_profiles',
      {
        pid: session.pid,
        student_profile_id: studentID,
      },
      {
        'Profile-Id': session.pid,
        'Auth-Token': session.token,
        Cookie: 'aid=' + API.AcademicYear,
        Accept: 'application/json',
      },
    );
  }

  static getClassmates(r: Request, session: SessionProperties) {
    return r.get(
      'https://dnevnik.mos.ru/core/api/profiles',
      {
        page: '1',
        per_page: '300',
        types: 'student',
        pid: session.pid,
      },
      {
        'Profile-Id': session.pid,
        'Auth-Token': session.token,
        Cookie: 'aid=' + API.AcademicYear,
        Accept: 'application/json',
        Referer: 'https://dnevnik.mos.ru/new_messages/new',
      },
    );
  }

  static setLinksList(
    r: Request,
    session: SessionProperties,
    hid: any,
    newAttachments: any[],
  ) {
    return r.post(
      `https://dnevnik.mos.ru/core/api/student_homeworks/${hid}`,
      {
        remote_attachments: newAttachments,
        homework_entry: {},
      },
      {
        method: 'PUT',
        'Profile-Id': session.pid,
        'Auth-Token': session.token,
        Cookie: 'aid=' + API.AcademicYear,
        Accept: 'application/json',
        Referer: 'https://dnevnik.mos.ru/new_messages/new',
      },
      'json',
      'json',
    );
  }

  static uploadFileToMos(
    r: Request,
    session: SessionProperties,
    homeworkId: string,
    file: unknown,
  ) {
    return r.post(
      `https://dnevnik.mos.ru/mobile/api/homeworks/${homeworkId}/attachment`,
      file,
      {
        method: 'POST',
        'Profile-Id': session.pid,
        'Auth-Token': session.token,
        Cookie: 'aid=' + API.AcademicYear,
        Accept: '*/*',
      },
      'multipart/form-data',
      'json',
    );
  }

  static setAttachmentsList(
    r: Request,
    session: SessionProperties,
    hid: any,
    newAttachments: (number | string)[],
  ) {
    return r.post(
      `https://dnevnik.mos.ru/core/api/student_homeworks/${hid}`,
      {
        attachment_ids: newAttachments,
        homework_entry: {},
      },
      {
        method: 'PUT',
        'Profile-Id': session.pid,
        'Auth-Token': session.token,
        Cookie: 'aid=' + API.AcademicYear,
        Accept: 'application/json',
        Referer: 'https://dnevnik.mos.ru/new_messages/new',
      },
      'json',
      'json',
    );
  }

  static getControlForms(
    r: Request,
    session: SessionProperties,
    ids: string[],
  ) {
    return r.get(
      'https://dnevnik.mos.ru/core/api/control_forms',
      {
        ids: ids,
        pid: session.pid,
      },
      {
        'Profile-Id': session.pid,
        'Auth-Token': session.token,
        Cookie: 'aid=' + API.AcademicYear,
        Accept: 'application/json',
        Referer: 'https://dnevnik.mos.ru/progress/all_marks',
      },
    );
  }

  static getMarks(
    r: Request,
    session: SessionProperties,
    studentID: string,
  ): Promise<ReportsAPIProgressJSON[]> {
    return r.get(
      'https://dnevnik.mos.ru/reports/api/progress/json',
      {
        academic_year_id: API.AcademicYear,
        pid: session.pid,
        student_profile_id: studentID,
      },
      {
        'Profile-Id': session.pid,
        'Auth-Token': session.token,
        Cookie: 'aid=' + API.AcademicYear,
        Referer: 'https://dnevnik.mos.ru/progress/all_marks',
      },
    );
  }

  static getScheduleItems(
    r: Request,
    session: SessionProperties,
    dateFrom: SDate,
    dateTo: SDate,
    studentID: string,
    groups: string,
  ): Promise<JerseyAPIScheduleItems[]> {
    return r.get(
      'https://dnevnik.mos.ru/jersey/api/schedule_items/',
      {
        academic_year_id: API.AcademicYear,
        from: dateFrom.yyyymmdd(),
        to: dateTo.yyyymmdd(),
        group_id: groups,
        pid: session.pid,
        student_profile_id: studentID,
        with_group_class_subject_info: 'true',
        with_rooms_info: 'true',
        with_course_calendar_info: 'true',
        with_lesson_info: 'true',
      },
      {
        'Profile-Id': session.pid,
        'Auth-Token': session.token,
      },
    );
  }

  static getScheduleItemsRooms(
    r: Request,
    session: SessionProperties,
    studentID: string,
    ids: string,
  ): Promise<CoreAPIRooms[]> {
    return r.get(
      'https://dnevnik.mos.ru/core/api/rooms',
      {
        ids,
        pid: session.pid,
        student_profile_id: studentID,
      },
      {
        'Profile-Id': session.pid,
        'Auth-Token': session.token,
      },
    );
  }

  static getScheduleMarks(
    r: Request,
    session: SessionProperties,
    dateFrom: SDate,
    dateTo: SDate,
    studentID: string,
  ): Promise<CoreAPIMarks[]> {
    return r.get(
      'https://dnevnik.mos.ru/core/api/marks',
      {
        created_at_from: dateFrom.ddmmyyyy(),
        created_at_to: dateTo.ddmmyyyy(),
        pid: session.pid,
        page: 1,
        per_page: 100,
        student_profile_id: studentID,
      },
      {
        'Profile-Id': session.pid,
        'Auth-Token': session.token,
        Cookie: 'aid=' + API.AcademicYear,
        Accept: 'application/json',
        Referer: 'https://dnevnik.mos.ru/progress/all_marks',
      },
    );
  }

  static getHomeWork(
    r: Request,
    session: SessionProperties,
    dateFrom: SDate,
    dateTo: SDate,
    studentID: string,
  ): Promise<CoreAPIStudentHomeworks[]> {
    return r.get(
      'https://dnevnik.mos.ru/core/api/student_homeworks',
      {
        academic_year_id: API.AcademicYear,
        begin_date: dateFrom.ddmmyyyy(),
        end_date: dateTo.ddmmyyyy(),
        pid: session.pid,
        per_page: 200,
        page: 1,
        student_profile_id: studentID,
      },
      {
        'Profile-Id': session.pid,
        'Auth-Token': session.token,
      },
      'json',
    );
  }

  static getChats(r: Request, session: SessionProperties) {
    return r.get(
      'https://dnevnik.mos.ru/core/api/chats',
      {
        per_page: 1000,
        pid: session.pid,
      },
      {
        'Profile-Id': session.pid,
        'Auth-Token': session.token,
      },
      'json',
    );
  }

  static getWebStudents(
    r: Request,
    session: SessionProperties,
  ): Promise<CoreAPIStudentProfiles[]> {
    return r.get(
      'https://dnevnik.mos.ru/core/api/student_profiles',
      {
        academic_year_id: API.AcademicYear,
        with_groups: 'true',
        with_archived_groups: 'true',
        with_user_info: 'true',
      },
      {'auth-token': session.token, 'profile-id': session.pid},
    );
  }

  static getSchoolById(
    r: Request,
    session: SessionProperties,
    schoolId: string | number,
  ): Promise<CoreAPISchools> {
    return r.get(
      `https://dnevnik.mos.ru/core/api/schools/${schoolId}`,
      {pid: session.pid},
      {'auth-token': session.token, 'profile-id': session.pid},
    );
  }

  static getMobileStudents(
    r: Request,
    session: SessionProperties,
  ): Promise<MobileAPIVProfile> {
    return r.get(
      'https://dnevnik.mos.ru/mobile/api/v1.0/profile',
      {},
      {'auth-token': session.token, 'profile-id': session.pid},
    );
  }

  static getMobileSchedule(
    r: Request,
    session: SessionProperties,
    studentId: string | number,
    yyyymmdd: string,
  ) {
    return r.get(
      'https://dnevnik.mos.ru/mobile/api/v1.0/schedule',
      {student_id: studentId, date: yyyymmdd},
      {'auth-token': session.token, 'profile-id': session.pid},
    );
  }
  static getMobileLessonInfo(
    r: Request,
    session: SessionProperties,
    studentId: string | number,
    itemId: string,
  ) {
    return r.get(
      'https://dnevnik.mos.ru/mobile/api/v1.0/lesson/' + itemId,
      {student_id: studentId},
      {'auth-token': session.token, 'profile-id': session.pid},
    );
  }

  static startAuth(r: Request, session: SessionProperties) {
    return r.get(
      `https://login.mos.ru/sps/oauth/ae?scope=openid+profile+blitz_user_rights+snils+contacts+blitz_change_password&access_type=offline&response_type=code&redirect_uri=https://dnevnik.mos.ru/sudir&state=${UUID()}&client_id=dnevnik.mos.ru`,
      {},
      {},
      'all',
    );
  }

  static async startSMSAuth(r: Request): Promise<string> {
    return await r.get(
      `https://login.mos.ru/sps/oauth/ae?scope=openid+profile&response_type=code&redirect_uri=https://dnevnik.mos.ru/sudir&access_type=offline&state=${UUID()}&client_id=dnevnik.mos.ru&bip_action_hint=used_sms`,
      {},
      {},
      'text',
    );
  }

  static getExistingLogin(
    r: Request,
    session: SessionProperties,
    userId: string | number,
  ): Promise<{value?: string}> {
    return r.get(
      `https://dnevnik.mos.ru/lms/api/sudir/user/${userId}/login`,
      {},
      {Host: 'dnevnik.mos.ru', 'auth-token': session.token},
      'json',
    );
  }

  static generateLogin(
    r: Request,
    session: SessionProperties,
    userId: string | number,
  ): Promise<{value?: string}> {
    return r.post(
      `https://dnevnik.mos.ru/lms/api/sudir/user/${userId}/login`,
      {},
      {Host: 'dnevnik.mos.ru', 'auth-token': session.token},
      'json',
    );
  }

  static hasMosruAccount(r: Request, userId: string | number) {
    return r.get(
      `https://dnevnik.mos.ru/acl/api/users/exists_sso?user_id=${userId}`,
      {},
      {},
      'json',
    );
  }

  static refreshToken(r: Request, session: SessionProperties) {
    return r.get(
      `https://dnevnik.mos.ru/lms/api/sudir/oauth/te/refresh_token`,
      {},
      {
        'Profile-Id': session.pid,
        'Auth-Token': session.token,
      },
      'json',
    );
  }

  static changeStudentPassword(
    r: Request,
    session: SessionProperties,
    userId: string | number,
    password: string,
  ): Promise<{code: number; message: string | null}> {
    return r.post(
      `https://dnevnik.mos.ru/lms/api/sudir/user/${userId}/password`,
      {value: password},
      {
        'Profile-Id': session.pid,
        'Auth-Token': session.token,
        'Content-Type': 'application/json',
      },
      'json',
    );
  }

  static createStudentAccount(
    r: Request,
    session: SessionProperties,
    userId: string | number,
    data: {
      FirstName: string;
      LastName: string;
      login: string;
      password: string;
    },
  ): Promise<{status: number; errors?: Array<{errMsg: string}>}> {
    return r.post(
      `https://dnevnik.mos.ru/lms/api/sudir/register/user/${userId}`,
      data,
      {
        method: 'PUT',
        'Profile-Id': session.pid,
        'Auth-Token': session.token,
        'Content-Type': 'application/json',
      },
      'json',
    );
  }
}
