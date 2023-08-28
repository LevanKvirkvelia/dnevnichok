import React from 'react';
import {Platform, Text, TouchableOpacity} from 'react-native';

import {IonIcon} from './IonIcon';
import {useTheme} from '../features/themes/useTheme';

export function IconButton(props: {
  size?: number;
  iconStyle?: any;
  name?: string;
  style?: any;
  onPress?: any;
  color?: string;
}) {
  const {colors} = useTheme();
  const {
    size = 30,
    iconStyle = {},
    name = '',
    style = {},
    onPress,
    color = colors.textOnPrimary,
  } = props;

  return (
    <TouchableOpacity
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}
      onPress={onPress}>
      <IonIcon name={name} style={iconStyle} size={size} color={color} />
    </TouchableOpacity>
  );
}
