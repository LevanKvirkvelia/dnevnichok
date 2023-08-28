import { Mark } from './Mark';

export interface IAttachment {
	title: string;
	link: string;
}

export interface ILesson {
	id: string | number;
	number: number;
	name?: string;
	place?: string;
	missed?: boolean;
	date: string;
	theme?: string;
	marks?: Mark[];
	homework?: { text: string; attachments: IAttachment[] };
	comment?: string;
	time?: {
		start?: string;
		end?: string;
	};
	teacher_fio?: string;
	lessonType?: string;
	teacherId?: string;
	extras?: { [key: string]: any };
}

export class Lesson {
	id: string | number = 0;
	number = 0;
	name = '';
	place: string = null;
	date = '';
	theme = '';
	missed = false;
	lessonType = null;
	homework: { text: string; attachments: any[] } = {
		text: '',
		attachments: [],
	};
	comment = '';
	marks: Mark[] = [];
	teacher_fio = '';
	time: { start?: string; end?: string } = { start: '', end: '' };
	extras: { [key: string]: any } = {};

	constructor(data: ILesson) {
		this.update(data);
	}

	update(data: ILesson) {
		Object.assign(this, data);
		this.marks.map(v => (v.date = this.date));
	}

	setV2(data: ILesson) {
		this.update(data);
		return this;
	}
}
