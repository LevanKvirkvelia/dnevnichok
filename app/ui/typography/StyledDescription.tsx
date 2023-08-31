import React from 'react';
import {Text, TextProps} from 'react-native';
import Color from 'color';
import {useTheme} from '../../features/themes/useTheme';

export function StyledDescription({children, style, ...props}: TextProps) {
  const {colors} = useTheme();
  return (
    <Text
      // TODO remove marginTop
      style={[{fontSize: 12, marginTop: -5, color: Color(colors.textOnRow).alpha(0.5).rgb().toString()}, style]}
      {...props}>
      {children}
    </Text>
  );
}
