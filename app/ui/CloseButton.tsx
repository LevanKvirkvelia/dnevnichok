import React from 'react';
import {IconProps} from 'react-native-vector-icons/Icon';
import {IonIcon} from './IonIcon';
import {useTheme} from '../features/themes/useTheme';

interface CloseButtonProps extends Partial<IconProps> {
  position?: 'absolute' | 'relative';
  top?: number;
}

export function CloseButton({
  position = 'relative',
  top = 10,
  style,
  ...props
}: CloseButtonProps) {
  const {isDark} = useTheme();

  return (
    <IonIcon
      name="close-circle"
      size={30}
      color={isDark ? 'rgba(229, 231, 238, 0.2)' : 'rgba(0, 0, 0, 0.13)'}
      style={[
        position === 'absolute' ? {position, right: 10, top, zIndex: 10} : {},
        style,
      ]}
      {...props}
    />
  );
}
