import {createSyncStoragePersister} from '@tanstack/query-sync-storage-persister';
import {MMKV} from 'react-native-mmkv';

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
