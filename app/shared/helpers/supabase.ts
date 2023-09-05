import 'react-native-url-polyfill/auto';
import {createClient} from '@supabase/supabase-js';
import {MMKV} from 'react-native-mmkv';

const storage = new MMKV({
  id: 'supabase',
});

const supabaseUrl = 'https://yfvydjgughatvaumodgy.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlmdnlkamd1Z2hhdHZhdW1vZGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM4OTE1NjIsImV4cCI6MjAwOTQ2NzU2Mn0.OUnaQC0y5BT_yUUdUGk_xjqU7RgiZXGdhMvImkBxI8Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      setItem: async (key: string, value: string) => {
        storage.set(key, value);
      },
      getItem: async (key: string) => {
        const value = storage.getString(key);
        return value === undefined ? null : value;
      },
      removeItem: async (key: string) => {
        storage.delete(key);
      },
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
