import {SDate, Marks, Day} from '..';

export interface IDiaryStudent {
  profileId: string;
  name: string;
  schoolId: string;
  classId: string;
  schoolName: string;
  className: string;
  [name: string]: any;
}

export interface IAuthData {
  login?: string;
  password?: string;
  code?: string;
  method?: 'gosuslugi' | 'default';
  engine?: string;
  host?: string;
  authProps?: Partial<{
    LoginType: number | string;
    cid: number | string;
    sid: number | string;
    pid: number | string;
    cn: number | string;
    sft: number | string;
    scid: number | string;
    [key: string]: any;
  }>;
  at?: any;
  cookie?: string | null;
  token?: string;
  pid?: string | number;
}

export interface Info {
  type: string;
  engine: string;
}

export interface IMinimumDiaryParser {
  clearCookies?(): Promise<void>;
  onAuthed: Promise<void>;
  login(authData: IAuthData, engine: string): Promise<boolean>;
  getDaysWithDay(user: any, sDate: SDate): Promise<Day[]>;
  getPeriodsWith(user: any, period?: string | number): Promise<Marks[]>;
  getAllPeriods(user: any): Promise<Marks[]>;
  getLenPeriods(user: any): Promise<number>;
  getStudents(): Promise<IDiaryStudent[]>;
  getAccountId(): Promise<string>;
}

export function UUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    },
  );
  return uuid;
}
