import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
import {zustandStorage} from '../../../shared/helpers/zustandStorage';

interface useAIStore {
  temporaryId: string;
  setTemporaryId: (id: string) => void;
  isForcedAB: boolean;
  setForcedAB: (isForcedAB: boolean) => void;

  counter: number[];
  setCounter: (counter: number[]) => void;
  incrementCounter: () => void;
}

export const useAIStore = create<useAIStore>()(
  persist(
    immer<useAIStore>((set, get) => ({
      setTemporaryId: (id: string) => set(state => void (state.temporaryId = id)),
      temporaryId: Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7),
      counter: [],
      incrementCounter: () => set(state => void state.counter.push(new Date().getTime())),
      setCounter: (counter: number[]) => set(state => void (state.counter = counter)),

      isForcedAB: false,
      setForcedAB: (isForcedAB: boolean) => set(state => void (state.isForcedAB = isForcedAB)),
    })),
    {
      name: 'ai-store',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
