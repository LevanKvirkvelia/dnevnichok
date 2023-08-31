import {createSyncStoragePersister} from '@tanstack/query-sync-storage-persister';
import {QueryClient} from '@tanstack/react-query';
import {MMKV} from 'react-native-mmkv';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 0,
      staleTime: 0,

      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    },
  },
});

const storage = new MMKV();

export const mmkvClientPersister = createSyncStoragePersister({
  storage: {
    setItem: (key, value) => {
      storage.set(key, value);
    },
    getItem: key => {
      const value = storage.getString(key);
      return value === undefined ? null : value;
    },
    removeItem: key => {
      storage.delete(key);
    },
  },
});
