import { Lesson } from './Lesson';

export class Day {
	lessons: Lesson[] = [];
	dayName = '';

	constructor(dayName: string) {
		this.dayName = dayName;
	}

	static create(dayName: string) {
		return new Day(dayName);
	}

	addLesson(lesson: Lesson) {
		this.lessons.push(lesson);
		this.lessons.sort((a, b) => {
			if (a.number == b.number) return a.name.localeCompare(b.name);
			return a.number - b.number;
		});
	}

	removeTopEmpty() {
		while (this.lessons.length > 0 && this.lessons[0].name == '') {
			this.lessons.splice(0, 1);
		}
		let i = 1;
		for (let lesson of this.lessons) {
			lesson.number = i;
			i++;
		}
	}

	removeEmptyLessons() {
		while (this.lessons.length > 0 && this.lessons[this.lessons.length - 1].name == '') {
			this.lessons.splice(this.lessons.length - 1, 1);
		}
	}
}
