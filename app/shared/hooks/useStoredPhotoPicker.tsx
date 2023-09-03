import {useMMKVString} from 'react-native-mmkv';
import {usePhotoPicker} from './usePhotoPicker';
import {Options, Image} from 'react-native-image-crop-picker';

export function useStoredPhotoPicker(key: string, options: Partial<Options> = {}) {
  const [base64Photo, setBase64] = useMMKVString(`storedPhoto/${key}`);

  const {showPicker, loading} = usePhotoPicker({
    onImage: (base64: string | null | undefined, mime: string) => {
      setBase64(base64 ? `data:${mime};base64,${base64}` : undefined);
    },
    onDelete: () => setBase64(undefined),
    hasPhoto: !!base64Photo,
    ...options,
  });

  return {
    base64Photo,
    showPicker,
    loading,
  };
}
