import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity} from 'react-native';

import {IonIcon} from './IonIcon';
import {getContrastColor} from '../helpers/getContrastColor';

export function NavButton(props: {
  left?: boolean;
  color?: string;
  size?: number;
  textStyle?: object;
  outline?: boolean;
  bg?: boolean;
  title?: string;
  iconName?: string;
  style?: object;
  onPress: () => void;
  accessibilityLabel?: string;
  iconProps?: object;
}) {
  const {
    left,
    color = '#007AAF',
    size = 18,
    textStyle = {},
    outline,
    bg,
    title,
    iconName,
    style = {},
    onPress,
    accessibilityLabel,
    iconProps = {},
  } = props;

  let textColor = color;
  let backStyle = {};
  if (typeof outline !== 'undefined')
    backStyle = {
      borderColor: color,
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
    };
  else if (typeof bg !== 'undefined') {
    backStyle = {
      backgroundColor: color,
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
    };
    textColor = getContrastColor(color);
  } else {
    backStyle = {padding: 8};
  }

  const text = title ? (
    <Text
      style={[
        {
          fontSize: size,
          color: textColor,
          ...textStyle,
        },
        Platform.OS === 'ios' ? {lineHeight: size - 1} : {},
      ]}>
      {title}
    </Text>
  ) : null;

  const icon = iconName ? (
    <IonIcon
      name={iconName}
      style={left ? {marginRight: 4} : {marginLeft: 4}}
      size={size * 1.4}
      color={textColor}
      {...iconProps}
    />
  ) : null;
  return (
    <TouchableOpacity
      accessible
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        },
        backStyle,
        style,
      ]}
      onPress={() => onPress()}>
      {left ? icon : null}
      {text}
      {!left ? icon : null}
    </TouchableOpacity>
  );
}
