import {
  Child,
  CoreAPIMarks,
  CoreAPIRooms,
  CoreAPISchools,
  CoreAPIStudentHomeworks,
  CoreAPIStudentProfiles,
  CoreAPITeacherProfiles,
  HomeworksTo,
  JerseyAPIScheduleItems,
  ReportsAPIProgressJSON,
} from './types';
import {IDaySchedule, ILesson, IMark, IPeriod} from '../../../data/types';
import {ParsedUser, SessionData} from '../../../../auth/state/useUsersStore';
import {stringMd5} from 'react-native-quick-md5';
import {DayScheduleConstructor, PeriodConstructor} from '../../../data/constructors';
import {SDate} from '../../../../auth/helpers/SDate';

export class Transformer {
  static createStudent(
    student: CoreAPIStudentProfiles | Child,
    school?: CoreAPISchools,
  ): ParsedUser {
    const isWebStudent = 'school_id' in student;
    const className = (isWebStudent ? student.class_unit?.name : student.class_name) || 'no class';
    const schoolId = isWebStudent ? student.school_id : student.school?.id;
    const schoolName =
      (isWebStudent ? school?.short_name : student.school?.short_name) || 'no school';
    const name = isWebStudent
      ? student.short_name
      : [student.last_name, student.first_name].filter(v => !!v).join(' ');
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
      engineUserData: {...student, school},
    };
  }

  static periodsWith(marks: ReportsAPIProgressJSON[]): IPeriod[] {
    const periods: PeriodConstructor[] = [];
    marks.map(subject =>
      subject.periods.map((period, index: number) => {
        if (!periods[index]) periods[index] = new PeriodConstructor(index + 1);

        let m = periods[index];
        const subjectId = stringMd5(subject.subject_name);
        m.upsertLessonData({
          id: subjectId,
          name: subject.subject_name,
          // todo fix final_mark
          // @ts-ignore
          resultMark: period.final_mark,
        });

        period.marks.map((i: any) => {
          m.addMark(subjectId, {
            id: i.id,
            value: i.values[0].five,
            weight: i.weight,
            name: i.topic_name ? i.topic_name + '. ' + i.control_form_name : i.control_form_name,
            date: i.date,
          });
        });
      }),
    );
    if (periods.length === 0) {
      const singlePeriod = new PeriodConstructor(0);
      marks.map(subject =>
        singlePeriod.upsertLessonData({
          id: stringMd5(subject.subject_name),
          name: subject.subject_name,
        }),
      );
      periods.push(singlePeriod);
    }

    return periods.map(p => p.toPeriod());
  }

  static webHomeworkByIds(
    session: SessionData,
    studentID: string,
    homeworkById: {
      [k: string]: CoreAPIStudentHomeworks;
    } = {},
    ids: HomeworksTo[],
  ): {text: string; attachments: any[]; userAttachments: any; teacherId: any} {
    const {texts, ...rest} = ids.reduce(
      (acc: any, i: any) => {
        try {
          if (!homeworkById[i.id] || !homeworkById[i.id].homework_entry) return acc;
          const entry = homeworkById[i.id].homework_entry;
          const homeworkEntryId = entry.id;
          const reports: {
            [k: string]: {testMaterialId: number; homeworkEntryId: number; userIds: string};
          } = {};
          if (Array.isArray(entry.eom_urls) && entry.eom_urls.length)
            entry.eom_urls.map(v => {
              if (v.type !== 'TestSpecification') return;
              reports[v.material_id] = {
                testMaterialId: v.material_id,
                homeworkEntryId,
                userIds: studentID,
              };
            });
          acc.teacherId = entry.homework.teacher_id;
          acc.userAttachments.id = homeworkById[i.id].id;
          if (Array.isArray(homeworkById[i.id].attachments))
            acc.userAttachments.files.push(...homeworkById[i.id].attachments);
          if (Array.isArray(homeworkById[i.id].remote_attachments))
            acc.userAttachments.links.push(...homeworkById[i.id].remote_attachments);
          if (Array.isArray(entry.attachments))
            acc.attachments.push(
              ...entry.attachments.map((a: any) => ({
                type: 'file',
                title: a.file_file_name,
                link: `https://dnevnik.mos.ru${a.path}`,
              })),
            );
          if (entry.tests && Array.isArray(JSON.parse(entry.tests))) {
            const tests = JSON.parse(entry.tests);
            acc.attachments.push(
              ...tests.map((t: any) => ({
                report: reports[t.id],
                type: 'test',
                title: t.name,
                link: `https://uchebnik.mos.ru/authenticate?authToken=${session.token}&profileId=${session.pid}&userId=${studentID}&referer=homework&backurl=https://uchebnik.mos.ru/exam/test/test_by_binding/${t.binding_id}/homework/${t.entry_id}?generation_context_type=homework`,
              })),
            );
          }
          if (entry.scripts && Array.isArray(JSON.parse(entry.scripts))) {
            const scripts = JSON.parse(entry.scripts);
            acc.attachments.push(
              ...scripts.map((s: any) => ({
                type: 'script',
                title: s.name,
                link: `https://uchebnik.mos.ru/authenticate?authToken=${session.token}&profileId=${session.pid}&userId=${studentID}&referer=diary&backurl=https://uchebnik.mos.ru/composer2/lesson/${s.id}/view?binding_id=${s.binding_id}`,
              })),
            );
          }
          if (entry.description) acc.texts.push(entry.description);
        } catch (e) {}
        return acc;
      },
      {texts: [], attachments: [], userAttachments: {links: [], files: []}},
    );

    return {text: texts.join('\n'), ...rest};
  }

  static webDurationToTime(time: number[], duration: number): {start: string; end: string} {
    const formatTime = (t: number[]) => t.map(n => n.toString().padStart(2, '0')).join(':');
    const start = formatTime(time.slice(0, 2));
    
    const totalMinutes = time[1] + duration;
    const end = [time[0] + Math.floor(totalMinutes / 60), totalMinutes % 60];
    
    return {start, end: formatTime(end)};
  }

  static webGroupMarksByLesson(scheduleMarks: CoreAPIMarks[]) {
    const groupedMarks: {[k: string]: CoreAPIMarks[]} = {};
    for (const mark of scheduleMarks) {
      if (!groupedMarks[mark.schedule_lesson_id]) {
        groupedMarks[mark.schedule_lesson_id] = [];
      }
      groupedMarks[mark.schedule_lesson_id].push(mark);
    }
    return groupedMarks;
  }

  static webMark(item: JerseyAPIScheduleItems, mark: CoreAPIMarks): IMark {
    return {
      date: Transformer.webDateFromItem(item).ddmmyyyy(),
      subjectName: item.lesson_name || '',
      value: +mark.name,
      weight: mark.weight,
      point: mark.is_point,
    };
  }
  static webDateFromItem(item: JerseyAPIScheduleItems) {
    return new SDate(new Date(item.date[0], item.date[1] - 1, item.date[2]));
  }

  static webDataToDays(
    session: SessionData,
    studentID: string,
    teachers: CoreAPITeacherProfiles[],
    homework: CoreAPIStudentHomeworks[],
    scheduleMarks: CoreAPIMarks[],
    scheduleItems: JerseyAPIScheduleItems[],
    rooms: CoreAPIRooms[],
  ): IDaySchedule[] {
    const homeworkById = Object.fromEntries(homework.map(i => [i.homework_entry.homework_id, i]));
    const marksObject = Transformer.webGroupMarksByLesson(scheduleMarks);
    if (!Array.isArray(scheduleItems)) return [];
    const days: {[k: string]: DayScheduleConstructor} = {};
    for (const item of scheduleItems) {
      const itemDate = Transformer.webDateFromItem(item);
      const ddmmyyyy = itemDate.ddmmyyyy();
      if (!days[ddmmyyyy]) days[ddmmyyyy] = new DayScheduleConstructor(ddmmyyyy);
      const homework = Transformer.webHomeworkByIds(
        session,
        studentID,
        homeworkById,
        item.homeworks_to_verify || [],
      );
      const teacher = teachers.find(teacher => teacher.id == homework.teacherId);
      const marks = marksObject[item.id]?.map(mark => Transformer.webMark(item, mark)) || [];
      const place = rooms?.find(p => p.id == item.room_id)?.number;
      days[ddmmyyyy].upsertLessonData(
        Transformer.webDataToLesson(item, homework, teacher, marks, place),
      );
    }
    return Object.values(days).map(d => d.toDaySchedule());
  }

  static webDataToLesson(
    item: JerseyAPIScheduleItems,
    homework: {
      text: string;
      attachments: any[];
      userAttachments: any;
      teacherId: any;
    },
    teacher: CoreAPITeacherProfiles | undefined,
    marks: IMark[],
    place?: string,
  ): ILesson {
    const types: any = {
      THEMATIC_TEST: 'Тематический тест',
      CONTROL_WORK: 'Контрольная работа',
    };
    const lessonType = (item.course_lesson_type && types[item.course_lesson_type]) || null;
    const time = Transformer.webDurationToTime(item.time, item.duration);
    return {
      id: stringMd5(item.subject_name),
      extras: {realId: item.id},
      lessonType,
      missed: false,
      theme: item.lesson_name || undefined,
      name: item.subject_name,
      date: Transformer.webDateFromItem(item).ddmmyyyy(),
      number: +item.study_ordinal,
      teacher: teacher && {
        id: teacher.id.toString(),
        name: teacher.name,
      },
      marks,
      homework,
      time,
      location: place,
    };
  }
}
