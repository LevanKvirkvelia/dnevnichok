import type {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import type {StackScreenProps} from '@react-navigation/stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

// ------------------ Auth ------------------
export type AuthModalStackParamList = {
  Login: undefined;
  Password: undefined;
  SMSAuth: undefined;
  MosPassword: undefined;
};

export type AuthModalNavigationProp = StackScreenProps<AuthModalStackParamList>;

// ------------------ Diary Tab ------------------
export type DiaryTabParamList = {
  Diary: undefined;
  LessionInfo: {
    index: number;
    title: string;
    ddmmyyyy: string;
  };
  InAppBrowser: {
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
  PeriodsTab: undefined;
  Profile: undefined;
};
export type TabsScreenProps<T extends keyof TabsParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

// ------------------ Root ------------------

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabsParamList>;
  Auth: NavigatorScreenParams<AuthModalStackParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<RootStackParamList, T>;
