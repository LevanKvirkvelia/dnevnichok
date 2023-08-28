import { SDate } from '../SDate';

export interface IMark {
	id?: string | number;
	value: number | string;
	weight: number;
	name: string;
	date?: string;
	subjectName?: string;
	used?: boolean;
	point?: boolean;
}

export class Mark {
	id = 0;
	value = 0;
	weight = 1;
	name = '';
	date = '';
	subjectName = '';
	studentName = '';
	point = false;
	used = false;
	constructor(data: IMark) {
		this.update(data);
	}

	update(data: IMark) {
		Object.assign(this, data);
	}

	getPushText() {
		if (!this.date && this.studentName) return `${this.value} по "${this.subjectName}" у ${this.studentName}`;
		if (!this.date) return `${this.value} по "${this.subjectName}"`;

		if (this.studentName)
			return `${SDate.parseDDMMYYY(this.date).rus()} - ${this.value} по "${this.subjectName}" у ${this.studentName}`;
		return `${SDate.parseDDMMYYY(this.date).rus()} - ${this.value} по "${this.subjectName}"`;
	}
}
