import { Day } from './Day';
import { Lesson } from './Lesson';

export class Diary {
	data: { [name: string]: Day } = {};

	static fromJSON(json: any) {
		let d = new Diary();
		d.data = json.data;
		return d;
	}

	addDay(dayName: string) {
		if (typeof this.data[dayName] != 'undefined') {
			return;
		}
		this.data[dayName] = new Day(dayName);
	}

	addLesson(dayName: string, lesson: Lesson) {
		this.addDay(dayName);
		this.data[dayName].addLesson(lesson);
	}

	get(dayName: string) {
		if (this.data.hasOwnProperty(dayName)) return this.data[dayName];
		return false;
	}

	removeEmptyLessons(dayName: string) {
		let it = this.get(dayName);
		if (it != false)
			while (it.lessons.length > 0 && it.lessons[it.lessons.length - 1].name == '') {
				it.lessons.splice(it.lessons.length - 1, 1);
			}
	}
}
