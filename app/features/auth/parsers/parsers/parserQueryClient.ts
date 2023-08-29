import {createSyncStoragePersister} from '@tanstack/query-sync-storage-persister';
import {QueryClient} from '@tanstack/react-query';
import {persistQueryClient} from '@tanstack/react-query-persist-client';
import {MMKV} from 'react-native-mmkv';

export const parserQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24 * 180, // 180 days
      staleTime: 1000 * 60 * 60, // 1 hour
    },
  },
});

const storage = new MMKV();

const clientPersister = createSyncStoragePersister({
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

persistQueryClient({
  queryClient: parserQueryClient,
  persister: clientPersister,
});
