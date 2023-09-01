import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
import {zustandStorage} from '../../../shared/helpers/zustandStorage';
import {useActiveUser} from '../../auth/hooks/useActiveUser';
import {useCallback} from 'react';

export type PeriodDate = {day: number; month: number};

interface usePeriodsState {
  userState: {
    [userId: string]:
      | {
          activePeriod?: number;
          variant?: 'automatic' | 'custom';
          customPeriods?: Array<PeriodDate>;
        }
      | undefined;
  };

  setActivePeriod(userId: string, number: number): void;
  setVariant(userId: string, variant: 'automatic' | 'custom'): void;
  setCustomPeriods(userId: string, periods: Array<PeriodDate>): void;
}

export const usePeriodsState = create<usePeriodsState>()(
  immer(
    persist(
      set => ({
        userState: {},
        setActivePeriod: (userId: string, number: number) => {
          set(state => {
            if (!state.userState[userId]) state.userState[userId] = {};
            state.userState[userId]!.activePeriod = number;
          });
        },

        setVariant: (userId: string, variant: 'automatic' | 'custom') => {
          set(state => {
            if (!state.userState[userId]) state.userState[userId] = {};
            state.userState[userId]!.variant = variant;
          });
        },

        setCustomPeriods: (userId: string, periods: Array<PeriodDate>) => {
          set(state => {
            if (!state.userState[userId]) state.userState[userId] = {};
            state.userState[userId]!.customPeriods = periods;
          });
        },
      }),
      {
        name: 'usePeriodsState',
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);

const emptyCustomPeriods: Array<PeriodDate> = [{day: 1, month: 9}];
export function useUserPeriodsState() {
  const user = useActiveUser();
  const {userState, setActivePeriod, setVariant, setCustomPeriods} = usePeriodsState();

  const {activePeriod = 1, customPeriods = emptyCustomPeriods, variant = 'automatic'} = userState[user.id] || {};
  return {
    activePeriodNumber: activePeriod,
    customPeriods,
    variant,
    setActivePeriod: useCallback((number: number) => setActivePeriod(user.id, number), [setActivePeriod]),
    setVariant: useCallback((variant: 'automatic' | 'custom') => setVariant(user.id, variant), [setVariant]),
    setCustomPeriods: useCallback(
      (periods: Array<PeriodDate>) => setCustomPeriods(user.id, periods),
      [setCustomPeriods],
    ),
  };
}
