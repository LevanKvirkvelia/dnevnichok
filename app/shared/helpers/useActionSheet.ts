import {useCallback} from 'react';
import Color from 'color';
import {
  ActionSheetProps,
  ActionSheetOptions,
  useActionSheet as useExpoActionSheet,
} from '@expo/react-native-action-sheet';
import {useTheme} from '../../features/themes/useTheme';

export interface ActionSheetOption {
  text: string;
  cancel?: boolean;
  destructive?: boolean;
  onPress?(): void;
}

export function useThemedActionSheet() {
  const {colors} = useTheme();
  const {showActionSheetWithOptions} = useExpoActionSheet();

  const showActionSheetThemed = useCallback<typeof showActionSheetWithOptions>(
    (options, callback) => {
      showActionSheetWithOptions(
        {
          messageTextStyle: {
            color: Color(colors.textOnRow).alpha(0.3).rgb().toString(),
          },
          titleTextStyle: {
            color: Color(colors.textOnRow).alpha(0.5).rgb().toString(),
          },
          containerStyle: {backgroundColor: colors.rowBackgroundColor},
          textStyle: {color: colors.textOnRow},
          separatorStyle: {backgroundColor: colors.border},
          ...options,
        },
        callback,
      );
    },
    [showActionSheetWithOptions, colors],
  );

  return useCallback(
    function showActionSheet<T extends ActionSheetOption = ActionSheetOption>(
      options: T[],
      params?: Omit<ActionSheetOptions, 'options' | 'destructiveButtonIndex' | 'cancelButtonIndex'>,
    ) {
      const texts = options.map(option => option.text);
      const callbacks = new Map(options.map((option, index) => [index, option.onPress]));
      const cancelButtonIndex = options.findIndex(option => option.cancel);
      const destructiveButtonIndex = options.findIndex(option => option.destructive);

      showActionSheetThemed({...params, options: texts, cancelButtonIndex, destructiveButtonIndex}, index => {
        if (typeof index === 'undefined') return;
        callbacks.get(index)?.();
      });
    },
    [showActionSheetThemed],
  );
}
