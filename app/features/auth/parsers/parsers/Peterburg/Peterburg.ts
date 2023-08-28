import axios from 'axios';
import { Day, Lesson, Marks, Mark, SDate, hash, IMinimumDiaryParser, Request, IAuthData } from '../..';
import {
	APIGroupGroupGetListPeriod,
	APIJournalEstimateTable,
	APIJournalLessonListByEducation,
	APIJournalPersonRelatedChildList,
	APIJournalScheduleListByEducation,
	APIUserAuthLogin,
	IndigoItem,
	TentacledItem,
} from '../../types/Peterburg';

type SessionProperties = {
	token?: string;
	authData?: { login: string; password?: string; engine: 'Петербургское образование' };
};

export class Peterburg implements IMinimumDiaryParser {
	static UnauthorizedError = 'Ошибка доступа';

	r: Request;

	session: SessionProperties = {};

	onAuthed: Promise<void>;

	resolveAuthed: (...rest) => void;

	async clearCookies() {
		// await CookieManager.clearAll()
		this.onAuthed = new Promise(ok => (this.resolveAuthed = ok));
		if (this.r) await this.r.clearCookies();
	}

	private async petersburgLogin(login: string, password: string): Promise<{ token: string }> {
		const logon: APIUserAuthLogin = await this.r.post(
			'https://dnevnik2.petersburgedu.ru/api/user/auth/login',
			{
				login: login,
				password: password,
				type: 'email',
				_isEmpty: false,
				activation_code: null,
			},
			{
				Accept: 'application/json, text/plain, */*',
				Referer: 'https://dnevnik2.petersburgedu.ru/login',
				'X-Requested-With': 'XMLHttpRequest',
			},
			'json',
			'json',
		);

		if (logon.data && typeof logon.data.token == 'string') {
			return logon.data;
		}

		throw new Error(logon?.validations[0]?.message || 'Неправильный логин или пароль');
	}

	async login(authData: IAuthData) {
		this.session = {
			token: authData.token || '',
			authData: {
				engine: 'Петербургское образование',
				login: authData.login || '',
				password: authData.password || '',
			},
		};

		const {
			authData: { login, password },
			token,
		} = this.session;

		if (!login) throw new Error('User login must be provided');

		this.r = new Request('Peterburg:' + [login, password].join(':'));

		await this.clearCookies();

		// user has already received their token
		if (token) {
			this.resolveAuthed();
			return true;
		}

		// if no password to re-login
		if (!password || authData.method === 'gosuslugi') {
			return false;
		}

		const relogin = await this.petersburgLogin(login, password);

		this.session.token = relogin.token;

		this.resolveAuthed();

		return true;
	}

	public assignEsiaHandler(handler: (login: string, password: string) => Promise<boolean>) {
		this.esiaLoginHandler = handler;
	}
	private esiaLoginHandler: (login: string, password: string) => Promise<boolean> | null = null;
	public async esiaLogin(authData: IAuthData, forceLogin = false) {
		const { login, password } = authData;

		if (!login || !password || forceLogin) {
			if (this.esiaLoginHandler) {
				return this.esiaLoginHandler(login, password);
			}

			return false;
		}

		return true;
	}

	async getEsiaLoginUrl(): Promise<string> {
		const { data: res } = await axios.get('https://dnevnik2.petersburgedu.ru/api/user/o-auth/url/esia');

		const url = res?.data?.url;

		if (url) return url;

		throw new Error('Произошла ошибка. Попробуйте позже');
	}

	async getEsiaToken(code: string, state: string): Promise<string> {
		const { data: res } = await axios.post(
			'https://dnevnik2.petersburgedu.ru/api/user/o-auth/login',
			{ code, state, type: 'esia' },
			{ headers: { 'Content-Type': 'application/json', Host: 'dnevnik2.petersburgedu.ru', Accept: '*/*' } },
		);

		const token = res?.data?.token;

		if (token) return token;

		throw new Error('Произошла ошибка. Попробуйте позже');
	}

	async getStudents() {
		const response = await this.r.get(
			'https://dnevnik2.petersburgedu.ru/api/journal/person/related-child-list',
			{},
			{
				'X-JWT-Token': this.session.token,
			},
			'all',
		);

		if ([401, 403].includes(response.status)) {
			throw new Error(Peterburg.UnauthorizedError);
		}

		const childList: APIJournalPersonRelatedChildList = response.data;

		return childList.data.items.map((student: any) => ({
			profileId: student.identity.id,
			name: `${student.surname} ${student.firstname}`,
			schoolId: student.educations[0].institution_id,
			educationId: student.educations[0].education_id,
			classId: String(student.educations[0].group_id),
			schoolName: student.educations[0].institution_name,
			className: student.educations[0].group_name,
			marksAccess: true,
		}));
	}

	async getDaysWithDay(user: any, sDate: SDate) {
		await this.onAuthed;
		const selectedDate = new SDate(sDate).copy().setMonday();
		const response: APIJournalLessonListByEducation = await this.r.get(
			'https://dnevnik2.petersburgedu.ru/api/journal/lesson/list-by-education',
			{
				p_limit: 1000,
				p_page: 1,
				p_datetime_from: selectedDate.ddmmyyyy(),
				p_datetime_to: selectedDate.copy().setDayPlus(6).ddmmyyyy(),
				'p_groups[]': user.classId,
				'p_educations[]': user.educationId,
				date: selectedDate.ddmmyyyy(),
			},
			{
				'X-JWT-Token': this.session.token,
			},
		);
		const schedule: APIJournalScheduleListByEducation = await this.r.get(
			'https://dnevnik2.petersburgedu.ru/api/journal/schedule/list-by-education',
			{
				p_limit: 1000,
				p_page: 1,
				p_datetime_from: selectedDate.ddmmyyyy(),
				p_datetime_to: selectedDate.copy().setDayPlus(6).ddmmyyyy() + ' 23:59:59',
				'p_groups[]': user.classId,
				'p_educations[]': user.educationId,
				date: selectedDate.ddmmyyyy(),
			},
			{
				'X-JWT-Token': this.session.token,
			},
		);

		const lessons: { [hash: string]: TentacledItem | IndigoItem } = {};

		[...schedule.data.items, ...response.data.items].forEach(item => {
			const itemHash = [item.subject_name, item.datetime_from, item.datetime_to, item.number].join(':');
			const lesson = lessons[itemHash] || {};

			lessons[itemHash] = { ...lesson, ...item };
		});

		const days = Object.values(lessons).reduce<{ [date: string]: Day }>((acc, item) => {
			const date = item.datetime_from.split(' ')[0];
			if (!acc[date]) acc[date] = new Day(date);
			acc[date].addLesson(
				new Lesson({
					name: item.subject_name,
					id: hash(item.subject_name),
					time: {
						start: item.datetime_from.split(' ')[1].slice(0, -3),
						end: item.datetime_to.split(' ')[1].slice(0, -3),
					},
					number: item.number,
					date: date,
					teacherId: String(item.subject_id),
					homework: {
						attachments: [],
						text: ('tasks' in item && item.tasks[0] && item.tasks[0].task_name) || '',
					},
					theme: ('content_name' in item && item.content_name) || '',
					marks:
						'estimates' in item
							? item.estimates.map(
									mark =>
										new Mark({
											id: '',
											value: +mark.estimate_value_name || 'H',
											weight: 1,
											name: mark.estimate_type_name || mark.estimate_value_name,
											date: date,
										}),
							  )
							: [],
				}),
			);

			return acc;
		}, {});

		return Object.values(days);
	}

	async getListPeriod(userData: any) {
		const response: APIGroupGroupGetListPeriod = await this.r.get(
			'https://dnevnik2.petersburgedu.ru/api/group/group/get-list-period',
			{
				'p_group_ids[]': userData.classId,
				p_limit: 20,
				p_page: 1,
			},
			{
				'X-JWT-Token': this.session.token,
			},
		);
		return response.data.items;
	}

	async getLenPeriods(userData: any) {
		const items = await this.getListPeriod(userData);
		return items.length - 1;
	}

	async getAllPeriods(userData: any) {
		let periodsLen = await this.getLenPeriods(userData);
		return await Promise.all(
			Array(periodsLen)
				.fill(null)
				.map(async (u, i: number) => (await this.getPeriodsWith(userData, i + 1))[0]),
		);
	}

	async getPeriodsWith(user: any, periodNum: number) {
		await this.onAuthed;
		const periods = await this.getListPeriod(user);
		const period = periods[periodNum - 1];

		let response: APIJournalEstimateTable = await this.r.get(
			'https://dnevnik2.petersburgedu.ru/api/journal/estimate/table',
			{
				'p_educations[]': user.educationId,
				p_date_from: period.date_from,
				p_date_to: period.date_to,
				p_limit: 1000,
				p_page: 1,
			},
			{
				'X-JWT-Token': this.session.token,
			},
		);

		let marks = new Marks();
		marks.number = periodNum;
		response.data.items.map((mark: any) => {
			const lessonId = hash(mark.subject_name);
			marks.addLesson(mark.subject_name, lessonId);
			if (
				mark.estimate_type_name != null &&
				(mark.estimate_type_name.indexOf('четверть') + 1 || mark.estimate_type_name.indexOf('триместр') + 1)
			) {
				marks.setResultMark(lessonId, +mark.estimate_value_name);
				return;
			}
			marks.addMark(
				lessonId,
				new Mark({
					value: +mark.estimate_value_name,
					weight: 1,
					id: mark.id,
					date: mark.date,
					subjectName: mark.subject_name,
					name: mark.estimate_type_name,
				}),
			);
		});
		return [marks];
	}

	async getAccountId() {
		return this.session.authData.engine + ':' + this.session.authData.login.toLowerCase();
	}


	getClassmates = () => undefined;

	async handleError(error: unknown, authData: IAuthData): Promise<never> {
		if (error === Peterburg.UnauthorizedError && authData.method === 'gosuslugi') {
			const isLogin = await this.esiaLogin(this.session.authData, true);

			if (isLogin === true) return;
		}

		throw error;
	}
}
