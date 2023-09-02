import {FetchQueryOptions} from '@tanstack/react-query';
import {SDate} from '../auth/helpers/SDate';
import {Account, User, AccountAuthData, SessionData, ParsedUser} from '../auth/state/useUsersStore';
import {IDaySchedule, IPeriod} from './data/types';

export type BaseProps = {
  account: Account;
  user: User;
};

type FeatureFunction<Props, ErrorType, DataType> = (props: Props) => Promise<DataType>;

type OptionalFeatureFunction<Props, ErrorType, DataType> = null | FeatureFunction<Props, ErrorType, DataType>;

type Feature<
  T extends {
    [key: string]: OptionalFeatureFunction<any, any, any> | FeatureFunction<any, any, any>;
  },
> = {
  [K in keyof T]: T[K];
};

type OptionalFeature<
  T extends {
    [key: string]: OptionalFeatureFunction<any, any, any> | FeatureFunction<any, any, any>;
  },
> = null | Feature<T>;

type AuthBaseProps = {
  authData: AccountAuthData;
  sessionData?: SessionData;
};

export interface ParserDefitionFeatures {
  auth: Feature<{
    login: OptionalFeatureFunction<
      Pick<Account, 'authData' | 'sessionData'>,
      Error,
      Pick<Account, 'sessionData' | 'engineAccountData'>
    >;
    getStudents: FeatureFunction<Pick<Account, 'authData' | 'sessionData' | 'engineAccountData'>, Error, ParsedUser[]>;
    getAccountId: FeatureFunction<Pick<Account, 'authData' | 'sessionData'>, Error, string>;
    backgroundLogin: FeatureFunction<
      Pick<Account, 'authData' | 'sessionData'>,
      Error,
      Pick<Account, 'sessionData' | 'engineAccountData'>
    >;
  }>;

  diary: Feature<{
    getDaysWithDay: FeatureFunction<{sDate: SDate} & BaseProps, Error, IDaySchedule[]>;
  }>;

  periods:
    | Feature<{
        getPeriodsWith: FeatureFunction<{period: string | number | undefined} & BaseProps, Error, IPeriod[]>;
        getAllPeriodsQuick: FeatureFunction<BaseProps, Error, IPeriod[]>;
        getPeriodsLenQuick: OptionalFeatureFunction<BaseProps, Error, number>;
      }>
    | Feature<{
        getPeriodsWith: FeatureFunction<{period: string | number | undefined} & BaseProps, Error, IPeriod[]>;
        getAllPeriodsQuick: OptionalFeatureFunction<BaseProps, Error, IPeriod[]>;
        getPeriodsLenQuick: FeatureFunction<BaseProps, Error, number>;
      }>;
}

export function createParser(parserFeatures: ParserDefitionFeatures) {
  const parserInstance = {
    ...parserFeatures,
    replaceFeature: (
      featureName:
        | `auth.${keyof ParserDefitionFeatures['auth']}`
        | `diary.${keyof ParserDefitionFeatures['diary']}`
        | `periods.${keyof ParserDefitionFeatures['periods']}`,
      newFeatureFunction: FeatureFunction<any, any, any>,
    ) => {
      const featurePath = featureName.split('.');
      let currentLevel: any = parserInstance;

      for (let i = 0; i < featurePath.length - 1; i++) {
        currentLevel = currentLevel[featurePath[i]];
      }

      currentLevel[featurePath[featurePath.length - 1]] = newFeatureFunction;
    },
  };

  return parserInstance;
}
