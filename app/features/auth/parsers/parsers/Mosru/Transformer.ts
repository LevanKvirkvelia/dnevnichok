import { hash, SDate } from '../..';
import { IDiaryStudent } from '../globalTypes';
import { Lesson, Mark, Marks, Day } from '../../MarkHolder';
import { SessionProperties } from './Mosru';
import {
	CoreAPIMarks,
	CoreAPIRooms,
	CoreAPIStudentHomeworks,
	JerseyAPIScheduleItems,
	ReportsAPIProgressJSON,
} from '../../types/MOS.RU';

export class Transformer {
	static webStudent(student: any, school: any): IDiaryStudent {
		return {
			...student,
			name: student?.short_name,
			schoolId: student?.school_id,
			schoolName: school?.short_name,
			classId: hash(student?.class_unit?.name),
			className: student?.class_unit?.name,
			profileId: student?.id,
			marksAccess: true,
		};
	}
	static mobileStudent(student: any): IDiaryStudent {
		return {
			...student,
			name: [student?.last_name, student?.first_name].filter(v => !!v).join(' '),
			schoolId: student?.school?.id,
			schoolName: student?.school?.short_name,
			classId: hash(student?.class_name),
			className: student?.class_name,
			profileId: student?.id,
			marksAccess: true,
			// ...(this.mosStudentsInfo.find((v: any) => v.profile_id == s.id) || {}),
		};
	}

	static periodsWith(marks: ReportsAPIProgressJSON[]) {
		let periods: Marks[] = [];
		marks.map((subject: any) =>
			subject.periods.map((period: any, index: number) => {
				if (!periods[index]) periods[index] = new Marks();
				periods[index].number = index + 1;
				let m = periods[index];
				m.addLesson(subject.subject_name, hash(subject.subject_name), '', '', period.final_mark);

				period.marks.map((i: any) => {
					m.addMark(
						hash(subject.subject_name),
						new Mark({
							id: i.id,
							value: i.values[0].five,
							weight: i.weight,
							name: i.topic_name ? i.topic_name + '. ' + i.control_form_name : i.control_form_name,
							date: i.date,
						}),
					);
				});
			}),
		);
		if (periods.length === 0) {
			let alonePeriod = new Marks();
			marks.map((subject: any) => alonePeriod.addLesson(subject.subject_name, hash(subject.subject_name), '', '', ''));
			periods.push(alonePeriod);
		}
		periods.map(i => {
			i.howPeriods = periods.length;
			i.activePeriod = periods.length - 1;
		});
		return periods;
	}

	static webHomeworkByIds(
		session: SessionProperties,
		studentID: string,
		homeworkById = {},
		ids = [],
	): { text: string; attachments: any[]; userAttachments: any; teacherId: any } {
		const { texts, ...rest } = ids.reduce(
			(acc: any, i: any) => {
				try {
					if (!homeworkById[i.id] || !homeworkById[i.id].homework_entry) return acc;
					const entry = homeworkById[i.id].homework_entry;
					const homeworkEntryId = entry.id;
					const reports = {};
					if (Array.isArray(entry.eom_urls) && entry.eom_urls.length)
						entry.eom_urls.map(v => {
							if (v.type !== 'TestSpecification') return;
							reports[v.material_id] = { testMaterialId: v.material_id, homeworkEntryId, userIds: studentID };
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
			{ texts: [], attachments: [], userAttachments: { links: [], files: [] } },
		);

		return { text: texts.join('\n'), ...rest };
	}

	static webDurationToTime(time, duration): { start: string; end: string } {
		const timeToStr = (t: (string | number)[]) => t.map((n, i) => (i === 1 ? ('00' + n).slice(-2) : n)).join(':');
		const start = timeToStr(time.slice(0, 2));
		let end = time.slice(0, 2);
		end[0] = end[0] + Math.floor((end[1] + duration) / 60);
		end[1] = (end[1] + duration) % 60;
		end = timeToStr(end);
		return { start, end };
	}

	static webGroupMarksByLesson(scheduleMarks) {
		return scheduleMarks.reduce((acc: any, mark: any) => {
			if (!acc[mark.schedule_lesson_id]) acc[mark.schedule_lesson_id] = [];
			acc[mark.schedule_lesson_id].push(mark);
			return acc;
		}, {});
	}
	static mobileMark(subjectName, ddmmyyyy, mark) {
		return new Mark({
			date: ddmmyyyy,
			subjectName,
			value: mark.value,
			weight: mark.weight,
			point: mark.is_point,
			name: '',
		});
	}
	static webMark(item, mark) {
		return new Mark({
			date: Transformer.webDateFromItem(item).ddmmyyyy(),
			subjectName: item.lesson_name,
			value: +mark.name,
			weight: mark.weight,
			point: mark.is_point,
			name: '',
		});
	}
	static webDateFromItem(item) {
		return new SDate(new Date(item.date[0], item.date[1] - 1, item.date[2]));
	}
	static webDataToDays(
		session,
		studentID,
		teachers,
		homework: CoreAPIStudentHomeworks[],
		scheduleMarks: CoreAPIMarks[],
		scheduleItems: JerseyAPIScheduleItems[],
		rooms: CoreAPIRooms[],
	): Day[] {
		const homeworkById = homework.reduce((all: any, i: any) => ({ ...all, [i.homework_entry.homework_id]: i }), {});
		const marksObject = Transformer.webGroupMarksByLesson(scheduleMarks);
		if (!Array.isArray(scheduleItems)) return [];
		const days = scheduleItems.reduce((acc: { [key: string]: Day }, item: any) => {
			const itemDate = Transformer.webDateFromItem(item);
			const ddmmyyyy = itemDate.ddmmyyyy();

			if (!acc[ddmmyyyy]) acc[ddmmyyyy] = new Day(ddmmyyyy);

			const homework = Transformer.webHomeworkByIds(session, studentID, homeworkById, item.homeworks_to_verify || []);
			const teacher = teachers.find((teacher: any) => teacher.id == homework.teacherId) || {};
			const marks = marksObject[item.id]?.map((mark: any) => Transformer.webMark(item, mark)) || [];
			const place = rooms?.find(p => p.id == item.room_id)?.number;
			acc[ddmmyyyy].addLesson(Transformer.webDataToLesson(item, homework, teacher, marks, place));

			return acc;
		}, {});
		return Object.values(days);
	}

	static webDataToLesson(item, homework, teacher, marks, place): Lesson {
		const types: any = {
			THEMATIC_TEST: 'Тематический тест',
			CONTROL_WORK: 'Контрольная работа',
		};
		let lessonType = types[item.course_lesson_type] || null;
		const time = Transformer.webDurationToTime(item.time, item.duration);
		return new Lesson({
			id: hash(item.subject_name),
			extras: { realId: item.id },
			lessonType,
			missed: false,
			theme: item.lesson_name,
			name: item.subject_name,
			date: Transformer.webDateFromItem(item).ddmmyyyy(),
			number: +item.study_ordinal,
			teacher_fio: teacher.name,
			teacherId: teacher.name,
			marks,
			homework,
			time,
			place,
		});
	}

	static mobileDataToLesson(item, homework, teacher, marks, ddmmyyyy, place): Lesson {
		let types: any = {
			THEMATIC_TEST: 'Тематический тест',
			CONTROL_WORK: 'Контрольная работа',
		};
		let lessonType = types[item.lesson.course_lesson_type] || null;

		return new Lesson({
			id: hash(item.lesson.subject_name),
			extras: { realId: item.lesson.scheduled_lesson_id },
			lessonType,
			missed: item.lesson.is_missed_lesson,
			theme: item.lesson.topic,
			name: item.lesson.subject_name,
			date: ddmmyyyy,
			number: +item.info.split(' ')[0],
			teacher_fio: teacher,
			teacherId: teacher,
			homework,
			place,
			time: { start: item.begin_time, end: item.end_time },
			marks,
		});
	}
}
