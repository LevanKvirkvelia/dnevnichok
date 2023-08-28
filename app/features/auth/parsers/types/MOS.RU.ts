export interface CoreAPIMarks {
  created_at: string;
  id: number;
  student_profile_id: number;
  weight: number;
  teacher_id: number;
  name: string;
  comment: null;
  control_form_id: number;
  deleted_by: null;
  grade_id: number;
  schedule_lesson_id: number;
  is_exam: boolean;
  group_id: number;
  date: string;
  is_point: boolean;
  point_date: null;
  subject_id: number;
  grade_system_id: number;
  grade_system_type: GradeSystemType;
  values: CoreAPIMarkValue[];
}

export enum GradeSystemType {
  Five = 'five',
}

export interface CoreAPIMarkValue {
  grade_system_id: number;
  name: string;
  nmax: number;
  grade_system_type: GradeSystemType;
  grade: Grade;
}

export interface Grade {
  origin: string;
  five: number;
  hundred: number;
}

export interface CoreAPISchools {
  id: number;
  county: string;
  name: string;
  short_name: string;
  ekis_key: string;
  ou_types: string;
  principal: string;
  phone: string;
  comments: string;
  guid: string;
  address: string;
  email: string;
  site: string;
}

export interface CoreAPIStudentHomeworks {
  id: number;
  created_at: string;
  updated_at: null;
  deleted_at: null;
  student_id: number;
  homework_entry_id: number;
  student_name: StudentName;
  comment: null;
  is_ready: boolean;
  attachments: any[];
  remote_attachments: any[];
  homework_entry: HomeworkEntry;
  attachment_ids: any[];
}

export interface HomeworkEntry {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  homework_id: number;
  description: string;
  duration: number;
  no_duration: boolean;
  homework: Homework;
  attachments: Attachment[];
  controllable_items: any[];
  homework_entry_comments: any[];
  student_ids: number[];
  attachment_ids: number[];
  controllable_item_ids: null;
  books: Books;
  tests: string;
  scripts: string;
  update_comment: null;
  is_long_term: boolean;
  game_apps: string;
  atomic_objects: string;
  related_materials: Books | null;
  eom_urls: EOMURL[];
  is_digital_homework: null;
}

export interface Attachment {
  id: number;
  created_at: string;
  file_file_name: string;
  file_content_type: FileContentType;
  file_file_size: number;
  path: string;
}

export enum FileContentType {
  ImageJPEG = 'image/jpeg',
}

export enum Books {
  Books = '[]',
  Empty = '',
}

export interface EOMURL {
  material_id: number;
  type: EOMURLType;
  content_type: Type | null;
  urls: URL[];
}

export enum Type {
  Test = 'test',
  Video = 'video',
}

export enum EOMURLType {
  AtomicObject = 'AtomicObject',
  GameApp = 'GameApp',
  LessonTemplate = 'LessonTemplate',
  TestSpecification = 'TestSpecification',
}

export interface URL {
  url_type: string;
  url: string;
  profile_type: null | string;
}

export interface Homework {
  id: number;
  created_at: string;
  updated_at: null | string;
  deleted_at: null;
  deleted_by: null;
  teacher_id: number;
  subject_id: number;
  is_required: boolean;
  mark_required: boolean;
  group_id: number;
  date_assigned_on: string;
  date_prepared_for: string;
  subject: Mentor;
}

export interface Mentor {
  id: number;
  name: string;
}

export enum StudentName {
  ГеворгАликовичСаргсян = 'Геворг Аликович Саргсян',
}

export interface CoreAPIStudentProfiles {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  transferred: boolean;
  school_id: number;
  user_id: number;
  study_mode_id: number;
  user_name: string;
  short_name: string;
  last_name: null;
  first_name: null;
  middle_name: null;
  change_password_required: boolean;
  birth_date: string;
  left_on: null;
  enlisted_on: null;
  gusoev_login: string;
  age: number;
  sex: string;
  deleted: boolean;
  email: null;
  phone_number: null;
  email_ezd: null;
  phone_number_ezd: null;
  class_unit: ClassUnit;
  previously_class_unit: null;
  curricula: ClassUnit;
  non_attendance: number;
  mentors: Mentor[];
  ispp_account: number;
  previously_profile_id: null;
  student_viewed: null;
  migration_date: null;
  education_level: null;
  class_level: null;
  snils: null;
  last_sign_in_at: null | string;
  groups: CoreAPIStudentProfileGroup[];
  parents: Parent[];
  marks: any[];
  final_marks: any[];
  attendances: any[];
  lesson_comments: any[];
  home_based_periods: any[];
  subjects: any[];
  ae_attendances: any[];
  ec_attendances: any[];
  assignments: any[];
  left_on_registry: null;
}

export interface ClassUnit {
  id: number;
  class_level_id: number | null;
  name?: string;
  home_based?: boolean;
  display_name?: string;
}

export interface CoreAPIStudentProfileGroup {
  user_profile_id: number;
  id: number;
  name: string;
  begin_date: BeginDate;
  end_date: EndDate;
  subgroup_ids: number[] | null;
  class_unit_ids: number[];
  metagroup: boolean;
  archived: boolean;
}

export enum BeginDate {
  The01092020 = '01.09.2020',
}

export enum EndDate {
  The31082021 = '31.08.2021',
}

export interface Parent {
  id: number;
  user_id: number;
  type: ParentType;
  gusoev_login: null | string;
  name: string;
  phone_number_ezd: null;
  email_ezd: null;
  phone_number: string;
  email: null | string;
  snils: null;
  last_sign_in_at: null | string;
  hidden: boolean;
}

export enum ParentType {
  ДоверенныйПредставитель = 'доверенный представитель',
  Родитель = 'Родитель',
}

export interface CoreAPITeacherProfiles {
  id: number;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: null;
  user_id: number | null;
  gusoev_login: null;
  name: string;
  school_id: number;
  type: TypeElement;
  roles: TypeElement[];
  mobility: Mobility;
  education_level_ids: any[];
  deleted: boolean;
  workload: number;
  subjects: Subject[];
  class_unit_ids: any[];
  class_units: any[];
  group_ids: any[];
  managed_class_unit_ids: number[];
  managed_class_units: ClassUnit[];
  building_ids: number[];
  buildings: Building[];
  room_ids: number[];
  assigned_group_ids: any[];
  assigned_ae_group_ids: any[];
  assigned_ec_group_ids: any[];
  rooms: CoreAPIRooms[];
  comment: null;
  user: User | null;
  virtual: boolean;
  gap_allowed: boolean;
  is_gap_allowed: boolean;
  for_consideration: boolean;
  subject_ids: number[];
  week_day_ids: any[];
  teacher_week_days: any[];
  replacement_groups_ids: any[];
  is_newcomer: null;
}

export interface Building {
  id: number;
  created_at: null;
  updated_at: null;
  deleted_at: null;
  name: string;
  address: string;
  school_id: null;
  rooms_number: null;
  floor_count: null;
  number: null;
  postal_index: null;
  county: null;
  gusoev_county_key: null;
  district: null;
  gusoev_district_key: null;
  eo_address: null;
  gusoev_eu_key: null;
  eu: null;
  city: null;
  gusoev_kladr_key: null;
  street: null;
  gusoev_address_key: null;
  building: null;
  description: null;
  education_level_ids: null;
  capacity: null;
  unom: null;
  image: null;
  type: null;
  org_territory: null;
}

export enum Mobility {
  Full = 'full',
  No = 'no',
}

export enum TypeElement {
  AEEducator = 'ae_educator',
  Deputy = 'deputy',
  Educator = 'educator',
  JuniorEducator = 'junior_educator',
  Principal = 'principal',
  SchoolAdmin = 'school_admin',
  SchoolAdminReadOnly = 'school_admin_read_only',
  Staff = 'staff',
  Teacher = 'teacher',
}

export interface CoreAPIRooms {
  id: number;
  created_at: null | string;
  updated_at: null | string;
  deleted_at: null;
  name: string;
  number: string;
  capacity: number;
  responsible_id: number | null;
  room_type_id: number | null;
  floor: number | null;
  description: null | string;
  education_level_ids: number[];
  subject_ids: number[];
  teacher_ids: number[];
  is_ae_education: boolean | null;
  is_subsidiary: boolean | null;
  is_administrative: boolean | null;
  building_id: number;
}

export interface Subject {
  id: number;
  created_at: null;
  updated_at: null;
  deleted_at: null;
  name: string;
  subject_group_id: null;
  school_id: null;
  parent_subject_id: null;
  is_curriculum_subject: boolean;
  is_discipline: boolean;
  only_group: boolean;
  is_adapt: boolean;
  is_spo: boolean;
  knowledge_field_ids: any[];
  curriculum_subject_ids: null;
  curriculum_subjects: null;
  discipline_ids: null;
  disciplines: null;
  children_subjects: null;
  curriculum_subject_attributes: null;
  curriculum_levels: null;
  control_forms: null;
  knowledge_field_link: any[];
  education_level_ids: number[];
}

export interface User {
  last_name: string;
  middle_name: string;
  first_name: string;
}

export interface JerseyAPIScheduleItems {
  id: number;
  day_number: number;
  lesson_number: number;
  study_ordinal: number;
  group_id: number;
  group_name: string;
  subject_id: number;
  subject_name: string;
  class_unit_id: number;
  schedule_id: number;
  teacher_id: number;
  room_id: number;
  room_name: RoomName;
  ordinal: number;
  building_id: number;
  bell_day_timetable_id: number;
  bell_timetable_id: number;
  bell_id: number;
  date: number[];
  time: number[];
  iso_date_time: Date;
  calendar_lesson_id: number | null;
  lesson_id: number | null;
  lesson_name: null | string;
  topic_id: number | null;
  topic_name: null | string;
  module_id: number | null;
  module_name: null | string;
  lesson_plan_id: number | null;
  duration: number;
  calendar_plan_id: number | null;
  periods_schedule_id: number;
  homeworks_to_give: HomeworksTo[] | null;
  homeworks_to_verify: HomeworksTo[] | null;
  controllable_items: null;
  current: boolean;
  replaced: boolean;
  cancelled: boolean;
  is_transferred: boolean;
  transferring_id: null;
  transferred_to_date: null;
  transferred_from_date: null;
  is_home_based: boolean;
  home_base_period_id: null;
  comment: null;
  lesson_type: LessonType;
  course_lesson_type: null;
  scripts: null | string;
  scripts_new: ScriptsNew[] | null;
  city_building_id: null;
}

export interface HomeworksTo {
  id: number;
}

export enum LessonType {
  Normal = 'NORMAL',
}

export enum RoomName {
  The1З = '1з',
  Информатика = 'Информатика',
}

export interface ScriptsNew {
  id: number;
  type: EOMURLType;
  name: string;
  description: null | string;
  rating: number;
  user_votes: {[key: string]: number};
  user_votes_count: number;
  user_name: string;
  user_id: number;
  profile_id: number;
  profile_type: ProfileType;
  own_material: boolean;
  created_at: Date;
  updated_at: Date;
  accepted_at: Date | null;
  moderation_status: ModerationStatus;
  class_level_from: null;
  class_level_to: null;
  alt_class_levels: any[];
  is_copy: boolean;
  studying_level_id: number;
  subject_id: number;
  subject_ids: number[];
  education_level_id: number;
  education_level_ids: number[];
  class_level_ids: Array<number[]>;
  education_metadata: EducationMetadata;
  material_has_grant: boolean;
  author_has_grant: boolean;
  is_abused: boolean;
  view_count: number;
  start_lesson_count?: number;
  start_mono_count?: number;
  fav_count: number;
  copy_count?: number;
  coauthors?: null | string;
  teaching_types?: number[];
  stage_count?: number;
  topic_name?: null | string;
  icon_url?: null | string;
  full_cover_url?: null | string;
  agreement_accepted: boolean;
  agreement_accepted_at: Date | null;
  free_layout?: boolean | null;
  template?: null;
  first_slide_url?: string;
  learningTargets: LearningTargets;
  author?: null | string;
  source?: null | string;
  restricted?: any[];
  special_tags?: SpecialTag[];
  game_app_category_id?: number;
  publisher_id?: number | null;
  publisher_name?: null | string;
  competition_id?: number | null;
  current_version_id?: number;
  published_version_id?: number;
  start_url?: string;
  usage_count?: number;
  content_type?: Type;
  logical_type_id?: number;
  logical_type_l_type?: Type;
  file_size?: string;
  file_format?: FileFormat;
  file_url?: string;
}

export interface EducationMetadata {
  material_education_areas: MaterialEducationArea[];
  studying_level_name: StudyingLevelName;
  time_to_study_human: null | string;
}

export interface MaterialEducationArea {
  id: number;
  subject_id: number;
  subject_name: SubjectName;
  is_adapt: boolean;
  education_level_id: number;
  education_level_name: EducationLevelName;
  class_level_ids: number[];
  controllable_items: ControllableItem[] | null;
}

export interface ControllableItem {
  id: number;
  name: string;
  code: string;
}

export enum EducationLevelName {
  Ооо = 'ООО',
  Соо = 'СОО',
}

export enum SubjectName {
  ВсеобщаяИстория = 'Всеобщая история',
  История = 'История',
  ИсторияРоссииВсеобщаяИстория = 'История России. Всеобщая история',
  Литература = 'Литература',
  РоднойЯзыкРусский = 'Родной язык (русский)',
  РусскийЯзык = 'Русский язык',
  Физика = 'Физика',
}

export enum StudyingLevelName {
  Базовый = 'Базовый',
}

export enum FileFormat {
  Mp4 = 'mp4',
}

export interface LearningTargets {
  forLesson: boolean;
  forHome: boolean;
}

export enum ModerationStatus {
  Accepted = 'accepted',
}

export enum ProfileType {
  PublisherProfile = 'PublisherProfile',
  TeacherProfile = 'TeacherProfile',
}

export interface SpecialTag {
  id: number;
  name: SpecialTagName;
  description: null;
  tag_type: TagType;
  materials_count: number;
  profile_id: null;
  profile_type: null;
  approved: boolean;
  created_at: Date;
  updated_at: Date;
  logo_url: null;
}

export enum SpecialTagName {
  Цдз = 'цдз',
  Цдзр = 'цдзр',
}

export enum TagType {
  Special = 'special',
}

export interface MobileAPIVProfile {
  profile: RepresentativeElement;
  children: Child[];
}

export interface Child {
  sex: string;
  id: number;
  phone: string;
  email: null | string;
  snils: string;
  type: null;
  school: School;
  groups: SectionElement[];
  representatives: RepresentativeElement[];
  sections: SectionElement[];
  last_name: string;
  first_name: null | string;
  middle_name: null | string;
  birth_date: Date;
  user_id: number;
  contract_id: number;
  class_name: string;
  class_level_id: number;
  class_unit_id: number;
  sudir_account_exists: boolean;
  sudir_login: null;
  is_legal_representative: boolean;
  parallel_curriculum_id: number;
}

export interface SectionElement {
  id: number;
  name: string;
  subject_id: number | null;
}

export interface RepresentativeElement {
  sex: null;
  id: number;
  phone: string;
  email: null | string;
  snils: null | string;
  type: null | string;
  last_name: string;
  first_name: string;
  middle_name: string;
  birth_date: Date | null;
  user_id: number | null;
  contract_id: null;
}

export interface School {
  id: number;
  name: string;
  county: string;
  principal: string;
  phone: string;
  short_name: string;
}

export interface MOSAuth {
  response: Response;
  cached: boolean;
}

export interface Response {
  id: number;
  email: string;
  profiles: ResponseProfile[];
  guid: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  phone_number: string;
  authentication_token: string;
  password_change_required: boolean;
  regional_auth: string;
  date_of_birth: Date;
  token: string;
  pid: number;
}

export interface ResponseProfile {
  id: number;
  type: string;
  agree_pers_data: boolean;
  children: any[];
}

export interface ReportsAPIProgressJSON {
  subject_name: string;
  periods: Period[];
  avg_five: string;
  avg_hundred: string;
}

export interface Period {
  name: PeriodName;
  marks: Mark[];
  start: string;
  end: string;
  start_iso: Date;
  end_iso: Date;
  avg_five: string;
  avg_hundred: string;
}

export interface Mark {
  id: number;
  values: MarkValue[];
  weight: number;
  is_exam: boolean;
  date: string;
  control_form_id: number;
  grade_system_type: GradeSystemType;
  topic_name?: string;
  control_form_name: string;
}

export interface MarkValue {
  five: number;
  hundred: number;
  original: string;
  nmax: number;
}

export enum PeriodName {
  ЗаПервоеПолугодие = 'За первое полугодие',
}
