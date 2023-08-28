export interface WebapiAuthGetdata {
	lt: string;
	ver: string;
	salt: string;
}

export interface WebapiGradeAssignmentTypes {
	abbr: string;
	order: number;
	id: number;
	name: string;
}

export interface WebapiLogin {
	at: string;
	timeOut: number;
	refreshToken: string;
	entryPoint: string;
	requestData: RequestData;
	errorMessage: null;
}

export interface RequestData {
	warnType: string;
}

export interface WebapiLogindata {
	productName: string;
	version: string;
	schoolLogin: boolean;
	emLogin: boolean;
	esiaLogin: boolean;
	esiaLoginPage: string;
	esiaMainAuth: boolean;
	esiaButton: boolean;
	signatureLogin: boolean;
	cacheVer: string;
	windowsAuth: boolean;
	enableSms: boolean;
	esaLogin: boolean;
	esaLoginPage: string;
}

export interface WebapiStudentDiary {
	weekStart: Date;
	weekEnd: Date;
	weekDays: WeekDay[];
	laAssigns: null;
	termName: string;
	className: string;
}

export interface WeekDay {
	date: Date;
	lessons: Lesson[];
}

export interface Lesson {
	classmeetingId: number;
	day: Date;
	number: number;
	relay: number;
	room: null;
	startTime: StartTime;
	endTime: EndTime;
	subjectName: SubjectName;
	assignments?: Assignment[];
}

export interface Assignment {
	mark: Mark | null;
	id: number;
	typeId: number;
	assignmentName: string;
	weight: number;
	dueDate: Date;
	classMeetingId: number;
}

export interface Mark {
	assignmentId: number;
	studentId: number;
	mark: number;
	dutyMark: boolean;
}

export enum EndTime {
	The0845 = '08:45',
	The0940 = '09:40',
	The1045 = '10:45',
	The1150 = '11:50',
	The1245 = '12:45',
	The1255 = '12:55',
	The1345 = '13:45',
	The1440 = '14:40',
	The1530 = '15:30',
}

export enum StartTime {
	The0800 = '08:00',
	The0855 = '08:55',
	The1000 = '10:00',
	The1105 = '11:05',
	The1200 = '12:00',
	The1205 = '12:05',
	The1300 = '13:00',
	The1400 = '14:00',
	The1450 = '14:50',
}

export enum SubjectName {
	АнглийскийЯзык = 'Английский язык',
	Астрономия = 'Астрономия',
	Информатика = '.Информатика.',
	История = 'История',
	Литература = 'Литература',
	МатематикаАлгебраИНачалаМатематическогоАнализа = 'Математика (Алгебра и начала математического анализа)',
	МатематикаГеометрия = 'Математика (Геометрия)',
	Обществознание = 'Обществознание',
	ОсновыБезопасностиЖизнедеятельности = 'Основы безопасности жизнедеятельности',
	РусскийЯзык = 'Русский язык',
	Физика = 'Физика',
	ФизическаяКультура = 'Физическая культура',
	Химия = 'Химия',
}

export interface WebapiStudentDiaryGetAttachments {
	assignmentId: number;
	attachments: Attachment[];
	answerFiles: any[];
}

export interface Attachment {
	id: number;
	name: null;
	originalFileName: string;
	description: null;
}

export interface WebapiStudentDiaryInit {
	students: Student[];
	currentStudentId: number;
	weekStart: Date;
	yaClass: boolean;
	yaClassAuthUrl: string;
	newDiskToken: string;
	newDiskWasRequest: boolean;
	ttsuRl: string;
	externalUrl: string;
	weight: boolean;
	maxMark: number;
	withLaAssigns: boolean;
}

export interface Student {
	studentId: number;
	nickName: string;
	className: null;
	classId: number;
	iupGrade: number;
}
