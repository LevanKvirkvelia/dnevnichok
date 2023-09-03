import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {zustandStorage} from '../../shared/helpers/zustandStorage';

interface useThemeState {
  backgroundNameOrUrl: string | 'custom' | null;
  setBackgroundNameOrUrl: (nameOrUrl: string | null) => void;

  paletteName: string;
  setPaletteName: (name: string) => void;
}

export const useThemeState = create<useThemeState>()(
  persist(
    set => ({
      backgroundNameOrUrl: null,
      setBackgroundNameOrUrl: nameOrUrl => set(() => ({backgroundNameOrUrl: nameOrUrl})),
      paletteName: 'green',
      setPaletteName: name => set(() => ({paletteName: name})),
    }),
    {
      name: 'theme',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
