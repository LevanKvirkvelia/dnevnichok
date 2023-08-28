export interface APIGroupGroupGetListPeriod {
	data: APIGroupGroupGetListPeriodData;
	validations: any[];
	messages: any[];
	debug: any[];
}

export interface APIGroupGroupGetListPeriodData {
	items: PurpleItem[];
	before: number;
	current: number;
	last: number;
	next: number;
	total_pages: number;
	total_items: number;
}

export interface PurpleItem {
	identity: PurpleIdentity;
	entity_state: EntityState;
	name: string;
	parent: number | null;
	date_from: string;
	date_to: string;
	education_period: EducationPeriod;
}

export interface EducationPeriod {
	id: number;
	code: string;
	name: string;
}

export interface EntityState {
	created_at: string;
	updated_at: string;
	deleted_at: null;
}

export interface PurpleIdentity {
	id: number;
	uid: string;
	guid: null;
	cid: null;
}

export interface APIJournalEstimateTable {
	data: APIJournalEstimateTableData;
	validations: any[];
	messages: any[];
	debug: any[];
}

export interface APIJournalEstimateTableData {
	items: FluffyItem[];
	before: number;
	current: number;
	last: number;
	next: number;
	total_pages: number;
	total_items: number;
}

export interface FluffyItem {
	id: number;
	education_id: number;
	lesson_id: number;
	subject_id: number;
	subject_name: string;
	date: string;
	estimate_value_code: string;
	estimate_value_name: string;
	estimate_type_code: string;
	estimate_type_name: Name;
	estimate_comment: null | string;
}

export enum Name {
	ДомашнееЗадание = 'Домашнее задание',
	КонтрольнаяРабота = 'Контрольная работа',
	ПрактическаяРабота = 'Практическая работа',
	ПроверочнаяРабота = 'Проверочная работа',
	РаботаНаУроке = 'Работа на уроке',
	СамостоятельнаяРабота = 'Самостоятельная работа',
	СрезоваяРабота = 'Срезовая работа',
}

export interface APIJournalLessonListByEducation {
	data: APIJournalLessonListByEducationData;
	validations: any[];
	messages: any[];
	debug: any[];
}

export interface APIJournalLessonListByEducationData {
	items: TentacledItem[];
	before: number;
	current: number;
	last: number;
	next: number;
	total_pages: number;
	total_items: number;
}

export interface TentacledItem {
	identity: FluffyIdentity;
	number: number;
	datetime_from: string;
	datetime_to: string;
	subject_id: number;
	subject_name: string;
	content_name: string;
	content_description: null;
	content_additional_material: null;
	tasks: Task[];
	estimates: Estimate[];
	action_payload: PurpleActionPayload;
}

export interface PurpleActionPayload {
	can_add_homework: boolean;
}

export interface Estimate {
	estimate_type_code: string;
	estimate_type_name: Name;
	estimate_value_code: string;
	estimate_value_name: string;
	estimate_comment: null | string;
}

export interface FluffyIdentity {
	id: number;
	uid: null;
}

export interface Task {
	task_name: string;
	task_code: null;
	task_kind_code: TaskKindCode;
	task_kind_name: Name;
	files: any[];
}

export enum TaskKindCode {
	Homework = 'homework',
}

export interface APIJournalPersonRelatedChildList {
	data: APIJournalPersonRelatedChildListData;
	validations: any[];
	messages: any[];
	debug: any[];
}

export interface APIJournalPersonRelatedChildListData {
	items: StickyItem[];
	before: number;
	current: number;
	last: number;
	next: number;
	total_pages: number;
	total_items: number;
}

export interface StickyItem {
	educations: Education[];
	action_payload: FluffyActionPayload;
	identity: TentacledIdentity;
	firstname: string;
	surname: string;
	middlename: string;
	hash_uid: string;
}

export interface FluffyActionPayload {
	can_apply_for_distance: boolean;
	can_print: null;
}

export interface Education {
	push_subscribe: boolean;
	education_id: number;
	group_id: number;
	group_name: string;
	institution_id: number;
	institution_name: string;
	jurisdiction_id: number;
	jurisdiction_name: string;
	is_active: null;
	distance_education: boolean;
	distance_education_updated_at: null;
	parent_firstname: null;
	parent_surname: null;
	parent_middlename: null;
	parent_email: null;
}

export interface TentacledIdentity {
	id: number;
}

export interface APIJournalScheduleListByEducation {
	data: APIJournalScheduleListByEducationData;
	validations: any[];
	messages: any[];
	debug: any[];
}

export interface APIJournalScheduleListByEducationData {
	items: IndigoItem[];
	before: number;
	current: number;
	last: number;
	next: number;
	total_pages: number;
	total_items: number;
}

export interface IndigoItem {
	number: number;
	datetime_from: string;
	datetime_to: string;
	subject_id: number;
	subject_name: string;
	priority: number;
	override_by_priority: boolean;
}

export interface APIUserAuthLogin {
	data: APIUserAuthLoginData;
	validations: any[];
	messages: any[];
	debug: any[];
}

export interface APIUserAuthLoginData {
	token: string;
}
