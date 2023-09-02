export type UserInfo = {
  userId: number;
  isAdActivated: boolean;
  info: {
    birthdate: string;
    mail: string;
    gender: string;
    trusted: boolean;
    FirstName: string;
    mobile: string;
    guid: string;
    failed: boolean;
    LastName: string;
    error: any;
    MiddleName: string;
    snils: string;
  };
  roles: Array<{
    id: number;
    title: string;
    subsystems: Array<{
      id: number;
      title: string;
      url: string;
      mnemonic: string;
      description: string;
      is_mobile: boolean;
      sort_order: number;
    }>;
  }>;
  savedChoice: any;
  notification: boolean;
  login: any;
};

export type WebV1Profile = {
  profile: {
    last_name: string;
    first_name: string;
    middle_name: string;
    birth_date: string;
    sex: string;
    user_id: number;
    id: number;
    contract_id: number;
    phone: string;
    email: string;
    snils: string;
    type: string;
  };
  children: Array<{
    last_name: string;
    first_name: string;
    middle_name: string;
    birth_date: string;
    sex: string;
    user_id: number;
    id: number;
    contract_id: number;
    phone: string;
    email: string;
    snils: string;
    type: any;
    school: {
      id: number;
      name: string;
      short_name: string;
      county: string;
      principal: string;
      phone: string;
      global_school_id: number;
    };
    class_name: string;
    class_level_id: number;
    class_unit_id: number;
    groups: Array<{
      id: number;
      name: string;
      subject_id: number;
      is_fake: boolean;
    }>;
    representatives: Array<{
      last_name: string;
      first_name: string;
      middle_name: string;
      birth_date: any;
      sex: any;
      user_id: any;
      id: number;
      contract_id: any;
      phone: string;
      email?: string;
      snils: string;
      type: any;
    }>;
    sections: Array<{
      id: number;
      name: string;
      subject_id: any;
      is_fake: boolean;
    }>;
    sudir_account_exists: boolean;
    sudir_login: any;
    is_legal_representative: boolean;
    parallel_curriculum_id: number;
    contingent_guid: string;
    enrollment_date: string;
  }>;
  hash: string;
};

export type EventcalendarV1ApiEvents = {
  total_count: number;
  response: {
    id: number;
    author_id: null;
    title: null;
    description: null;
    start_at: string;
    finish_at: string;
    is_all_day: null;
    conference_link: null;
    outdoor: null;
    place: null;
    place_latitude: null;
    place_longitude: null;
    created_at: null;
    updated_at: null;
    types: null;
    author_name: null;
    registration_start_at: null;
    registration_end_at: null;
    source: string;
    source_id: string;
    place_name: null;
    contact_name: null;
    contact_phone: null;
    contact_email: null;
    comment: null;
    need_document: null;
    type: null;
    format_name: null;
    url: null;
    subject_id: number;
    subject_name: string;
    room_name: string;
    room_number: string;
    replaced: boolean;
    replaced_teacher_id: null;
    esz_field_id: null;
    lesson_type: string;
    course_lesson_type: null;
    lesson_education_type: null;
    lesson_name: null | string;
    lesson_theme: null | string;
    activities: null;
    link_to_join: null;
    control: null;
    class_unit_ids: null;
    class_unit_name: string;
    group_id: number;
    group_name: string;
    external_activities_type: null;
    address: null;
    place_comment: null;
    building_id: number;
    building_name: string;
    city_building_name: null;
    cancelled: boolean;
    is_missed_lesson: boolean;
    is_metagroup: null;
    absence_reason_id: null;
    nonattendance_reason_id: null;
    visible_fake_group: null;
    health_status: null;
    student_count: null;
    attendances: null;
    journal_fill: boolean;
    comment_count: null;
    comments: null;
    homework: {
      presence_status_id: number;
      total_count: number;
      execute_count: number | null;
      descriptions: string[] | null;
      link_types: null;
      materials: {
        count_execute: number;
        count_learn: number;
      } | null;
      entries:
        | {
            homework_entry_id: number;
            date_assigned_on: string;
            date_prepared_for: string;
            description: string;
            duration: number;
            materials: string;
            attachment_ids: any[];
            attachments: any[];
            student_ids: null;
          }[]
        | null;
    };
    materials:
      | {
          uuid: string;
          learningTargets: {
            forLesson: boolean;
            forHome: boolean;
          };
          isHiddenFromStudents: boolean;
        }[]
      | null;
    marks: any[];
  }[];
};

export type LmsApiSessions = {
  id: number;
  email: string;
  snils: string;
  profiles: Array<{
    id: number;
    type: string;
    roles: Array<any>;
    user_id: number;
    agree_pers_data: boolean;
    subject_ids: Array<any>;
  }>;
  guid: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  phone_number: string;
  authentication_token: string;
  person_id: string;
  password_change_required: boolean;
  regional_auth: string;
  date_of_birth: string;
  sex: string;
};
