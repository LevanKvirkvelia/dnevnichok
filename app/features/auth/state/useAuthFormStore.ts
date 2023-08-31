import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';
import {EngineNames} from '../../parsers/parsers/getParser';

interface AuthFormState {
  engine: EngineNames;
  setEngine: (engine: EngineNames) => void;

  form: {
    login: string;
    password: string;
  };
  setForm: (form: Partial<AuthFormState['form']>) => void;
  clearForm: () => void;

  error?: string;
  setError: (error?: string) => void;
}

export const useAuthFormStore = create<AuthFormState>()(set => ({
  engine: 'MOS.RU',
  form: {
    login: '',
    password: '',
  },

  clearForm: () => set(() => ({form: {login: '', password: ''}})),
  setEngine: engine => set(() => ({engine})),
  setForm: form =>
    set(state => ({
      form: {...state.form, ...form},
    })),

  setError: error => set(() => ({error})), // todo remove
}));
