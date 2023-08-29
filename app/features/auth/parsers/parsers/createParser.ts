import {SDate} from '../../helpers/SDate';
import {
  Account,
  AccountAuthData,
  ParsedUser,
  SessionData,
  User,
} from '../../state/useUsersStore';
import {IDaySchedule, IPeriod} from '../data/types';
import {FetchQueryOptions} from '@tanstack/react-query';
import {parserQueryClient} from './parserCache';

export type BaseProps = {
  account: Account;
  user: User;
};

type FeatureFunction<Props, ErrorType, DataType> = FetchQueryOptions<
  DataType,
  ErrorType,
  DataType,
  [Props]
>;

type OptionalFeatureFunction<Props, ErrorType, DataType> =
  null | FeatureFunction<Props, ErrorType, DataType>;

type Feature<
  T extends {
    [key: string]:
      | OptionalFeatureFunction<any, any, any>
      | FeatureFunction<any, any, any>;
  },
> = {
  [K in keyof T]: T[K];
};

type OptionalFeature<
  T extends {
    [key: string]:
      | OptionalFeatureFunction<any, any, any>
      | FeatureFunction<any, any, any>;
  },
> = null | Feature<T>;

export interface ParserDefitionFeatures {
  auth: Feature<{
    login: OptionalFeatureFunction<
      {
        authData: AccountAuthData;
        sessionData?: SessionData;
      },
      Error,
      boolean
    >;
    backgroundLogin: FeatureFunction<BaseProps, Error, boolean>;
    getStudents: FeatureFunction<BaseProps, Error, ParsedUser[]>;
    getAccountId: FeatureFunction<BaseProps, Error, string>;
  }>;

  diary: Feature<{
    getDaysWithDay: FeatureFunction<{sDate: SDate} & BaseProps, Error, IDaySchedule[]>;
  }>;

  periods: Feature<{
    getPeriodsWith: FeatureFunction<
      {
        period: string | number | undefined;
      } & BaseProps,
      Error,
      IPeriod[]
    >;
    getAllPeriods: FeatureFunction<BaseProps, Error, IPeriod[]>;
    getLenPeriods: FeatureFunction<BaseProps, Error, number>;
  }>;
}

function wrapFeatureFunction<Props, ErrorType, DataType>(
  functionName: string,
  featureFunction: FeatureFunction<Props, ErrorType, DataType>,
) {
  return (props: Props) => {
    return parserQueryClient.fetchQuery({
      ...featureFunction,
      queryKey: [props],
      queryKeyHashFn: ([props]) => {
        const {account, user, ...rest} = props as any;

        const params =
          featureFunction.queryKeyHashFn?.([props]) ||
          Object.entries(rest)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([key, value]) => `${key}:${value?.toString()}`)
            .join('|');

        return `${functionName}:${account?.id}:${user?.id}:${params}`;
      },
    });
  };
}

export function createParser(parserFeatures: ParserDefitionFeatures) {
  return {
    auth: {
      login:
        parserFeatures.auth.login &&
        wrapFeatureFunction('login', parserFeatures.auth.login),
      backgroundLogin: wrapFeatureFunction(
        'backgroundLogin',
        parserFeatures.auth.backgroundLogin,
      ),
      getStudents: wrapFeatureFunction(
        'getStudents',
        parserFeatures.auth.getStudents,
      ),
      getAccountId: wrapFeatureFunction(
        'getAccountId',
        parserFeatures.auth.getAccountId,
      ),
    },
    diary: {
      getDaysWithDay: wrapFeatureFunction(
        'getDaysWithDay',
        parserFeatures.diary.getDaysWithDay,
      ),
    },
    periods: {
      getPeriodsWith: wrapFeatureFunction(
        'getPeriodsWith',
        parserFeatures.periods.getPeriodsWith,
      ),
      getAllPeriods: wrapFeatureFunction(
        'getAllPeriods',
        parserFeatures.periods.getAllPeriods,
      ),
      getLenPeriods: wrapFeatureFunction(
        'getLenPeriods',
        parserFeatures.periods.getLenPeriods,
      ),
    },
  };
}
