import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {zustandStorage} from '../../shared/helpers/zustandStorage';

interface useStore {
  lastAd: number;
  firstAuth: number;

  updateLastAd: () => void;
}
export const useAdsStore = create<useStore>()(
  persist(
    (set, get) => ({
      lastAd: 0,
      firstAuth: Date.now(),

      // Actions
      updateLastAd: () =>
        set(() => ({
          lastAd: new Date().getTime(),
        })),
    }),
    {
      name: 'ads-store',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
