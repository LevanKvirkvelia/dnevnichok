import ImagePicker, {Image} from 'react-native-image-crop-picker';
import {useCallback, useMemo, useState} from 'react';
import {errorToString} from '../helpers/errorToString';
import {ActionSheetOption, useThemedActionSheet} from './useActionSheet';
import {showMessage} from '../../ui/FlashMessage';

const OPTION_TEXTS = {
  CANCEL: 'Отмена',
  PHOTO: 'Сделать фото',
  UPLOAD: 'Загрузить из медиатеки',
  DELETE: 'Удалить изображение',
};

export function usePhotoPicker({
  onImage,
  optionTexts,
  onDelete,
  hasPhoto,
  ...pickerOptions
}: {
  onImage: (base64: string | null | undefined, mime: string) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
  optionTexts?: Partial<typeof OPTION_TEXTS>;
  hasPhoto: boolean;
} & Partial<Image>) {
  const [loading, setLoading] = useState(false);

  const uploadFile = useCallback(async () => {
    setLoading(true);
    try {
      const image = await ImagePicker.openPicker({
        includeBase64: true,
        mediaType: 'photo',
        forceJpg: true,
        compressImageQuality: 0.45,
        ...pickerOptions,
      });
      await onImage(image.data, image.mime);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [onImage, pickerOptions]);

  const takePhoto = useCallback(async () => {
    setLoading(true);
    try {
      const image = await ImagePicker.openCamera({
        includeBase64: true,
        mediaType: 'photo',
        compressImageQuality: 0.45,
        forceJpg: true,
        cropping: true,
        compressImageMaxWidth: 500,
        width: 500,
        compressImageMaxHeight: 500,
        height: 500,
        ...pickerOptions,
      });
      await onImage(image.data, image.mime);
    } catch (e) {
      showMessage({
        message: errorToString(e),
        type: 'danger',
      });
    }
    setLoading(false);
  }, [onImage, pickerOptions]);

  const onDeleteWrap = useCallback(async () => {
    setLoading(true);
    try {
      await onDelete();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [onDelete]);

  const options = useMemo<ActionSheetOption[]>(() => {
    const joinedOptions = {...OPTION_TEXTS, ...optionTexts};
    return [
      {text: joinedOptions.CANCEL, cancel: true},
      {text: joinedOptions.PHOTO, onPress: takePhoto},
      {text: joinedOptions.UPLOAD, onPress: uploadFile},
      ...(hasPhoto ? [{text: joinedOptions.DELETE, onPress: onDeleteWrap}] : []),
    ];
  }, [hasPhoto, onDeleteWrap, optionTexts, takePhoto, uploadFile]);

  const showActionSheet = useThemedActionSheet();

  const showPicker = useCallback(() => {
    showActionSheet(options);
  }, [options, showActionSheet]);

  return {showPicker, loading};
}
