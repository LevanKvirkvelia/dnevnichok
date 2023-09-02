export interface IMark {
  id?: string | number;
  subjectName?: string;

  value: number | string;
  weight: number;

  name?: string;
  date?: string;

  point?: boolean;
}

export interface ISubjectPeriod {
  id: string | number;
  periodId: string | number;

  name: string;
  marks: IMark[];

  forcedAverage?: string | number;
  resultMark?: number | string;
}

export type IPeriod = {
  id: string | number;
  subjects: ISubjectPeriod[];
};

export interface IAttachment {
  title: string;
  link: string;
}

export interface ILesson {
  id: string | number;
  numberFrom1: number;
  date: string;
  name?: string;

  missed?: boolean;
  marks?: IMark[];

  topic?: string;
  location?: string;
  homework?: {text?: string; attachments?: IAttachment[]};
  comment?: string;

  time?: {
    start?: string;
    end?: string;
  };
  teacher?: {
    id?: string;
    name?: string;
  };

  lessonType?: string; // Контрольная работа, Тематический тест
  extras?: {[key: string]: any};
}

export type IDaySchedule = {
  ddmmyyyy: string;
  lessons: ILesson[];
};
