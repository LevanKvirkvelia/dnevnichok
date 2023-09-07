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
  response: Array<{
    id: number;
    author_id: any;
    title: any;
    description: any;
    start_at: string;
    finish_at: string;
    is_all_day: any;
    conference_link: any;
    outdoor: any;
    place: any;
    place_latitude: any;
    place_longitude: any;
    created_at: any;
    updated_at: any;
    types: any;
    author_name: any;
    registration_start_at: any;
    registration_end_at: any;
    source: string;
    source_id: string;
    place_name: any;
    contact_name: any;
    contact_phone: any;
    contact_email: any;
    comment: any;
    need_document: any;
    type: any;
    format_name: any;
    url: any;
    subject_id: number;
    subject_name: string;
    room_name: string;
    room_number: string;
    replaced: boolean;
    replaced_teacher_id: any;
    esz_field_id: any;
    lesson_type: string;
    course_lesson_type: any;
    lesson_education_type: any;
    lesson_name?: string;
    lesson_theme?: string;
    activities: any;
    link_to_join: any;
    control: any;
    class_unit_ids: any;
    class_unit_name: string;
    group_id: number;
    group_name: string;
    external_activities_type: any;
    address: any;
    place_comment: any;
    building_id: number;
    building_name: string;
    city_building_name: any;
    cancelled: boolean;
    is_missed_lesson: boolean;
    is_metagroup: any;
    absence_reason_id: any;
    nonattendance_reason_id: any;
    visible_fake_group: any;
    health_status: any;
    student_count: any;
    attendances: any;
    journal_fill: boolean;
    comment_count: any;
    comments: any;
    homework: {
      presence_status_id: number;
      total_count: number;
      execute_count?: number;
      descriptions?: Array<string>;
      link_types: any;
      materials?: {
        count_execute: number;
        count_learn: number;
      };
      entries?: Array<{
        homework_entry_id: number;
        date_assigned_on: string;
        date_prepared_for: string;
        description: string;
        duration: number;
        materials?: string;
        attachment_ids: Array<any>;
        attachments: Array<any>;
        student_ids: any;
      }>;
    };
    materials?: Array<{
      uuid: string;
      learningTargets: {
        forLesson: boolean;
        forHome: boolean;
      };
      isHiddenFromStudents: boolean;
    }>;
    marks: Array<{
      id: number;
      comment: any;
      comment_exists: boolean;
      control_form_name: string;
      is_exam: boolean;
      is_point: boolean;
      point_date: any;
      original_grade_system_type: string;
      criteria: Array<{
        name: string;
        value: string;
      }>;
      value: string;
      values: Array<{
        name: string;
        grade_system_id: number;
        grade_system_type: string;
        nmax: number;
        grade: {
          five: number;
          hundred: number;
          origin: string;
        };
      }>;
      weight: number;
    }>;
  }>;
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

export type ReportsAPIProgressJSON = Array<{
  subject_name: string;
  subject_id: number;
  periods: Array<{
    name: string;
    marks: Array<{
      id: number;
      comment: string;
      values: Array<{
        five: number;
        hundred: number;
        original: string;
        nmax: number;
      }>;
      weight: number;
      is_exam: boolean;
      date: string;
      is_point: boolean;
      control_form_id: number;
      grade_system_type: string;
      topic_name: string;
      control_form_name: string;
    }>;
    start: string;
    end: string;
    start_iso: string;
    end_iso: string;
    avg_five: string;
    avg_hundred: string;
  }>;
  avg_five: string;
  avg_hundred: string;
}>;
