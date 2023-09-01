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

export type PeriodsTabScreenProps = CompositeScreenProps<
  TabsScreenProps<keyof TabsParamList>,
  StackScreenProps<PeriodsTabParamList>
>;

// ------------------ Diary Tab ------------------

export type DiaryTabParamList = {
  Diary: undefined;
  LessionInfo: {
    index: number;
    title: string;
    ddmmyyyy: string;
  };
  InAppBrowser?: {
    displayUrl?: string;
    startUrl?: string;
    nextUrl?: string;
    title?: string;
  };
};

export type DiaryTabScreenProps = CompositeScreenProps<
  TabsScreenProps<keyof TabsParamList>,
  StackScreenProps<DiaryTabParamList>
>;

// ------------------ Tabs ------------------

export type TabsParamList = {
  DiaryTab: NavigatorScreenParams<DiaryTabParamList>;
  PeriodsTab: NavigatorScreenParams<PeriodsTabParamList>;
  Profile: undefined;
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
