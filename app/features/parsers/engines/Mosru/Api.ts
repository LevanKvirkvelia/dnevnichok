import { Req } from '../../../auth/helpers/Req';
import { SDate } from '../../../auth/helpers/SDate';
import { SessionData } from '../../../auth/state/useUsersStore';
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
} from './types';

export class API {
  static AcademicYear = '9';

  static getTeachers(
    session: SessionData,
    studentID: string,
  ): Promise<CoreAPITeacherProfiles[]> {
    return Req.get(
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

  static setLinksList(session: SessionData, hid: any, newAttachments: any[]) {
    return Req.post(
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
    session: SessionData,
    homeworkId: string,
    file: unknown,
  ) {
    return Req.post(
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
    session: SessionData,
    hid: any,
    newAttachments: (number | string)[],
  ) {
    return Req.post(
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

  static getControlForms(session: SessionData, ids: string[]) {
    return Req.get(
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
    session: SessionData,
    studentID: string,
  ): Promise<ReportsAPIProgressJSON[]> {
    return Req.get(
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
    session: SessionData,
    dateFrom: SDate,
    dateTo: SDate,
    studentID: string,
    groups: string,
  ): Promise<JerseyAPIScheduleItems[]> {
    return Req.get(
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
    session: SessionData,
    studentID: string,
    ids: string,
  ): Promise<CoreAPIRooms[]> {
    return Req.get(
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
    session: SessionData,
    dateFrom: SDate,
    dateTo: SDate,
    studentID: string,
  ): Promise<CoreAPIMarks[]> {
    return Req.get(
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
    session: SessionData,
    dateFrom: SDate,
    dateTo: SDate,
    studentID: string,
  ): Promise<CoreAPIStudentHomeworks[]> {
    return Req.get(
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

  static getWebStudents(
    session: SessionData,
  ): Promise<CoreAPIStudentProfiles[]> {
    return Req.get(
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
    session: SessionData,
    schoolId: string | number,
  ): Promise<CoreAPISchools> {
    return Req.get(
      `https://dnevnik.mos.ru/core/api/schools/${schoolId}`,
      {pid: session.pid},
      {'auth-token': session.token, 'profile-id': session.pid},
    );
  }

  static getMobileStudents(session: SessionData): Promise<MobileAPIVProfile> {
    return Req.get(
      'https://dnevnik.mos.ru/mobile/api/v1.0/profile',
      {},
      {'auth-token': session.token, 'profile-id': session.pid},
    );
  }

  static getMobileSchedule(
    session: SessionData,
    studentId: string | number,
    yyyymmdd: string,
  ) {
    return Req.get(
      'https://dnevnik.mos.ru/mobile/api/v1.0/schedule',
      {student_id: studentId, date: yyyymmdd},
      {'auth-token': session.token, 'profile-id': session.pid},
    );
  }
  
  static getMobileLessonInfo(
    session: SessionData,
    studentId: string | number,
    itemId: string,
  ) {
    return Req.get(
      'https://dnevnik.mos.ru/mobile/api/v1.0/lesson/' + itemId,
      {student_id: studentId},
      {'auth-token': session.token, 'profile-id': session.pid},
    );
  }

  static getExistingLogin(
    session: SessionData,
    userId: string | number,
  ): Promise<{value?: string}> {
    return Req.get(
      `https://dnevnik.mos.ru/lms/api/sudir/user/${userId}/login`,
      {},
      {Host: 'dnevnik.mos.ru', 'auth-token': session.token},
      'json',
    );
  }

  static generateLogin(
    session: SessionData,
    userId: string | number,
  ): Promise<{value?: string}> {
    return Req.post(
      `https://dnevnik.mos.ru/lms/api/sudir/user/${userId}/login`,
      {},
      {Host: 'dnevnik.mos.ru', 'auth-token': session.token},
      'json',
    );
  }

  static hasMosruAccount(userId: string | number) {
    return Req.get(
      `https://dnevnik.mos.ru/acl/api/users/exists_sso?user_id=${userId}`,
      {},
      {},
      'json',
    );
  }

  static refreshToken(session: SessionData) {
    return Req.get(
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
    session: SessionData,
    userId: string | number,
    password: string,
  ): Promise<{code: number; message: string | null}> {
    return Req.post(
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
    session: SessionData,
    userId: string | number,
    data: {
      FirstName: string;
      LastName: string;
      login: string;
      password: string;
    },
  ): Promise<{status: number; errors?: Array<{errMsg: string}>}> {
    return Req.post(
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
