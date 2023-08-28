import { Mark } from './Mark';

export interface LessonPeriod {
	marks: Mark[];
	middle: string | number | null;
	name: string;
	result_mark: number | string;
	id: string | number;
	subject_id: string | number;
	period_id: string | number;
}

export class Marks {
	data: { [lessonId: string]: LessonPeriod } = {};
	howPeriods: number = 3;
	activePeriod: number = 1;
	number = 0;
	showing: any;

	clear() {
		this.data = {};
	}

	/* functions for Mobile App*/

	static fromJSON(json: any): Marks {
		let d = new Marks();
		d.data = json.data;
		d.howPeriods = json.howPeriods;
		d.showing = json.showing;
		d.activePeriod = json.activePeriod;
		return d;
	}

	static getColorByMiddle(middle: number): string {
		middle = +middle;
		if (!middle) return '#12c3bd';
		if (middle >= 5 - 0.3) return '#12c3bd';
		if (middle >= 5 - 0.5) return '#ffcc00';
		return '#ec6045';
	}

	static marksArrayToHtml(ar: any[]): string {
		let html = [];
		for (let m in ar) {
			let mark: Mark = ar[m];
			if (mark.weight > 1) {
				html.push(`
					<span class='mark-width'>
						${mark.value}
						<sub>${mark.weight}</sub>
					</span>
				`);
			} else {
				html.push(`<span class='mark-width'>${mark.value}</span>`);
			}
		}
		return html.join(' ');
	}

	getClassByID(id: string | number, target: any) {
		let middle = this.getMiddleByID(id);
		if (!middle || middle == 0) return 'nothing';
		if (middle >= target - 0.3) return 'good';
		if (middle >= target - 0.5) return 'normal';
		return 'problem';
	}

	getColorByID(id: string | number, target: any) {
		return (
			{
				good: '#12c3bd',
				normal: '#ffcc00',
				problem: '#ec6045',
				nothing: '#d8d8db',
			}[this.getClassByID(id, target)] || '#d8d8db'
		);
	}

	getHardColorByID(id: string | number, target: any) {
		return this.getColorByID(id, target);
		return (
			{
				good: '#1a7374',
				normal: '#a68400',
				problem: '#D32F2F',
				nothing: '#d8d8db',
			}[this.getClassByID(id, target)] || '#d8d8db'
		);
	}

	getHidenMiddleByID(id: string | number): any {
		if (id == '') return false;
		try {
			return this.data[id].middle;
		} catch (E) {
			return '';
		}
	}

	getMiddleByName(name: string | null): any {
		if (name == '') return false;

		for (let i in this.data) {
			if (this.data[i].name == name) return this.data[i].middle;
		}
	}

	/* common functions */

	sort() {
		let dataArray = [];
		for (let o in this.data) {
			dataArray.push(this.data[o]);
		}
		dataArray.sort(function (a, b) {
			return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
		});
		return dataArray;
	}

	getMiddleByID(id: string | number): number | null {
		if (!id || !this.data[id] || typeof this.data[id].middle == null || typeof this.data[id].middle == 'undefined')
			return null;
		// @ts-ignore
		return (+this.data[id].middle).toFixed(2);
	}

	getMarks(dayName: string, lesson_id: string | number) {
		let ar = [];
		try {
			for (let m of this.data[lesson_id].marks) {
				if (m.date == dayName) {
					ar.push(m);
				}
			}
		} catch (e) {
			return [];
		}
		return ar;
	}

	addLesson(
		lessonName: string,
		id: string | number,
		middle: string | null = null,
		period_id = '',
		result_mark = '',
		subject_id = '',
	) {
		if (!this.data.hasOwnProperty(id)) {
			this.data[id] = {
				marks: [],
				middle: middle,
				name: lessonName,
				result_mark: result_mark,
				id: id,
				subject_id: subject_id,
				period_id: period_id,
			};
		} else {
			this.data[id].name = this.data[id].name || lessonName;
			this.data[id].middle = this.data[id].middle || middle;
			this.data[id].period_id = this.data[id].period_id || period_id;
			this.data[id].subject_id = this.data[id].subject_id || subject_id;
			this.data[id].result_mark = this.data[id].result_mark || result_mark;
		}
	}

	setResultMark(id: string | number, mark: string | number) {
		this.data[id].result_mark = mark;
	}

	getLessonClass(id: string | number, target: number) {
		let middle = this.getMiddleByID(id);
		if (!middle || middle == 0) return 'nothing';
		if (middle >= target - 0.3) return 'good';
		if (middle >= target - 0.5) return 'normal';
		return 'problem';
	}

	addMark(lessonID: string | number, mark: Mark) {
		let id = lessonID;
		if (isNaN(+mark.value)) return;
		if (!this.data[id]) {
			this.data[id] = {
				marks: [mark],
				middle: mark.value,
				id: id,
				subject_id: '',
				period_id: '',
				result_mark: '',
				name: '',
			};
			return;
		}

		this.data[id].marks.push(mark);
		let sum = 0,
			sum2 = 0;
		for (let i = 0; i < this.data[id].marks.length; i++) {
			sum += this.data[id].marks[i].value * this.data[id].marks[i].weight;
			sum2 += +this.data[id].marks[i].weight;
		}
		this.data[id].middle = (sum / sum2).toFixed(2);
	}

	clearMarks(lessonID: string | number) {
		if (!this.data[lessonID]) {
			this.data[lessonID] = {
				marks: [],
				middle: (0.0).toFixed(2),
				id: lessonID,
				subject_id: '',
				period_id: '',
				result_mark: '',
				name: '',
			};
			return;
		}
		this.data[lessonID].marks = [];
	}
}
