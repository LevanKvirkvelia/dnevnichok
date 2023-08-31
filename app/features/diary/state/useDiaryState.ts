import {create} from 'zustand';
import {SDate} from '../../auth/helpers/SDate';

interface useDiaryState {
  currentDisplayDate: string;
  setCurrentDisplayDate: (date: string) => void;
}

export const useDiaryState = create<useDiaryState>()(set => ({
  currentDisplayDate: new SDate().ddmmyyyy(),
  setCurrentDisplayDate: date => set({currentDisplayDate: date}),
}));
