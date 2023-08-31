import React from 'react';
import {View, TouchableOpacity, ViewProps, TouchableOpacityProps} from 'react-native';
import {useTheme} from '../features/themes/useTheme';

export function Switch({children, style, ...props}: ViewProps) {
  const {isDark} = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: isDark ? 'rgba(41, 42, 46, 1)' : 'rgb(240,240,243)',
          flexDirection: 'row',
          paddingVertical: 3,
          paddingHorizontal: 3,
          borderRadius: 8,
          alignSelf: 'flex-start',
        },
        style,
      ]}
      {...props}>
      {children}
    </View>
  );
}

export function SwitchItem({children, onPress, style, ...props}: TouchableOpacityProps) {
  return (
    <TouchableOpacity
      delayPressIn={0}
      onPress={onPress}
      style={[{paddingVertical: 5, paddingHorizontal: 10, borderRadius: 6, alignItems: 'center'}, style]}
      {...props}>
      {children}
    </TouchableOpacity>
  );
}
