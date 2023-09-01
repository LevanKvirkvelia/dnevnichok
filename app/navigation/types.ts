import type {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import type {StackScreenProps} from '@react-navigation/stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {ISubjectPeriod} from '../features/parsers/data/types';

// ------------------ Periods Tab ------------------

export type PeriodsTabParamList = {
  Periods: undefined;
  SubjectInfo: {
    subject: ISubjectPeriod;
  };
  PeriodsSettings: undefined;
};

export type PeriodsTabScreenProps<T extends keyof PeriodsTabParamList> = CompositeScreenProps<
  StackScreenProps<PeriodsTabParamList, T>,
  TabsScreenProps<keyof TabsParamList>
>;

// ------------------ Diary Tab ------------------

export type DiaryTabParamList = {
  Diary: undefined;
  LessonInfo: {
    index: number;
    ddmmyyyy: string;
  };
  InAppBrowser?: {
    displayUrl?: string;
    startUrl?: string;
    nextUrl?: string;
    title?: string;
  };
};

export type DiaryTabScreenProps<T extends keyof DiaryTabParamList> = CompositeScreenProps<
  StackScreenProps<DiaryTabParamList, T>,
  TabsScreenProps<keyof TabsParamList>
>;

// ------------------ Profile Tab ------------------

export type ProfileTabParamList = {
  Students: undefined;
  Theme: undefined;
  Admin: undefined;
};

export type ProfileTabScreenProps<T extends keyof DiaryTabParamList> = CompositeScreenProps<
  StackScreenProps<DiaryTabParamList, T>,
  TabsScreenProps<keyof TabsParamList>
>;

// ------------------ Tabs ------------------

export type TabsParamList = {
  DiaryTab: NavigatorScreenParams<DiaryTabParamList>;
  PeriodsTab: NavigatorScreenParams<PeriodsTabParamList>;
  ProfileTab: NavigatorScreenParams<ProfileTabParamList>;
};

export type TabsScreenProps<T extends keyof TabsParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

// ------------------ Auth ------------------

export type AuthModalStackParamList = {
  Login: undefined;
  Password: undefined;
  SMSAuth: undefined;
  MosPassword: undefined;
};

export type AuthModalNavigationProp = StackScreenProps<AuthModalStackParamList>;

// ------------------ Root ------------------

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabsParamList>;
  Auth: NavigatorScreenParams<AuthModalStackParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<RootStackParamList, T>;
