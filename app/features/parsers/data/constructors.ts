import {IDaySchedule, ILesson, ISubjectPeriod, IMark, IPeriod} from './types';

export class PeriodConstructor {
  periodId: string | number = '';
  data: {[lessonId: string]: ISubjectPeriod} = {};

  constructor(periodId: string | number) {
    this.periodId = periodId;
  }

  upsertLessonData(
    lesson: Partial<ISubjectPeriod> & Pick<ISubjectPeriod, 'id'>,
  ) {
    if (this.data[lesson.id]) {
      this.data[lesson.id] = {...this.data[lesson.id], ...lesson};
    } else {
      this.data[lesson.id] = {
        ...lesson,
        periodId: this.periodId,
        marks: [],
        name: '',
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
  date: string = '';

  constructor(date: string) {
    this.date = date;
  }

  upsertLessonData(lesson: Omit<ILesson, 'a'>) {
    this.data[lesson.id] = {...this.data[lesson.id], ...lesson};
  }

  toDaySchedule(): IDaySchedule {
    return {
      date: this.date,
      lessons: Object.values(this.data).sort((a, b) => a.number - b.number),
    };
  }
}
