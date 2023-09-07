import {IDaySchedule, ILesson, ISubjectPeriod, IMark, IPeriod} from './types';

export class PeriodConstructor {
  periodId: string | number = '';
  data: {[lessonId: string]: ISubjectPeriod} = {};

  constructor(periodId: string | number) {
    this.periodId = periodId;
  }

  upsertLessonData(lesson: Partial<ISubjectPeriod> & Pick<ISubjectPeriod, 'id'>) {
    if (this.data[lesson.id]) {
      this.data[lesson.id] = {...this.data[lesson.id], ...lesson};
    } else {
      this.data[lesson.id] = {
        name: '',
        marks: [],
        ...lesson,
        periodId: this.periodId,
      };
    }
  }

  addMark(lessonId: string, mark: IMark) {
    if (!this.data[lessonId]) {
      this.data[lessonId] = {
        id: lessonId,
        name: '',
        periodId: this.periodId,
        marks: [],
      };
    }

    this.data[lessonId].marks.push(mark);
  }

  toPeriod(): IPeriod {
    return {
      id: this.periodId,
      subjects: Object.values(this.data),
    };
  }
}

export class DayScheduleConstructor {
  data: {[lessonNumber: string]: ILesson} = {};
  ddmmyyyy: string = '';

  constructor(ddmmyyyy: string) {
    this.ddmmyyyy = ddmmyyyy;
  }

  upsertLessonData(lesson: Omit<ILesson, 'a'>) {
    this.data[lesson.id] = {...this.data[lesson.id], ...lesson};
  }

  toDaySchedule(): IDaySchedule {
    return {
      ddmmyyyy: this.ddmmyyyy,
      lessons: Object.values(this.data).sort((a, b) => a.numberFrom1 - b.numberFrom1),
    };
  }
}
