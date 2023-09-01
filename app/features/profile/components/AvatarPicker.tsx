import React, {forwardRef, useImperativeHandle} from 'react';
import {useActiveUser} from '../../auth/hooks/useActiveUser';
import {useMMKVString} from 'react-native-mmkv';
import {usePhotoPicker} from '../../../shared/hooks/usePhotoPicker';
import {Link} from '../../../ui/Link';

export type AvatarPickerRef = {
  showAvatarPicker: () => void;
};

// TODO rewrite this component as Provider
export const AvatarPicker = forwardRef<AvatarPickerRef>((_, ref) => {
  const user = useActiveUser();
  const [base64Avatar, setBase64Avatar] = useMMKVString(`avatar-${user.id}`);

  const {showPicker} = usePhotoPicker({
    onImage: (base64: string | null | undefined, mime: string) => {
      setBase64Avatar(base64 ? `data:${mime};base64,${base64}` : undefined);
    },
    onDelete: () => setBase64Avatar(undefined),
    hasPhoto: !!base64Avatar,
  });

  useImperativeHandle(ref, () => ({showAvatarPicker: showPicker}));

  return <Link onPress={showPicker}>{base64Avatar ? 'Изменить аватарку' : 'Добавить аватарку'}</Link>;
});
