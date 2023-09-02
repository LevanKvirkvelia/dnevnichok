import {Req} from '../../../auth/helpers/Req';
import {Account, SessionData} from '../../../auth/state/useUsersStore';
import {EventcalendarV1ApiEvents, WebV1Profile} from './types';

export class API {
  static AcademicYear = '11';

  static getStudents(account: Pick<Account, 'engineAccountData' | 'sessionData'>): Promise<WebV1Profile> {
    return Req.get(
      'https://school.mos.ru/api/family/web/v1/profile?nocache=true',
      {},
      {
        'auth-token': account.sessionData!.token,
        'profile-id': account.sessionData!.pid,
        'X-mes-subsystem': 'familyweb',
        'X-Mes-Role': account.engineAccountData.profiles[0].type,
      },
    );
  }

  static getEventcalendar(
    account: Account,
    person_ids: string,
    begin_YYYYMMDD: string,
    end_YYYYMMDD: string,
  ): Promise<EventcalendarV1ApiEvents> {
    return Req.get(
      `https://school.mos.ru/api/eventcalendar/v1/api/events`,
      {
        person_ids,
        begin_date: begin_YYYYMMDD,
        end_date: end_YYYYMMDD,
        expand: 'marks,homework,absence_reason_id,health_status,nonattendance_reason_id',
      },
      {
        'auth-token': account.sessionData!.token,
        'profile-id': account.sessionData!.pid,
        'X-mes-subsystem': 'familyweb',
        Authorization: `Bearer ${account.sessionData!.token}`,
        'X-Mes-Role': account.engineAccountData.profiles[0].type,
      },
    );
  }
}
