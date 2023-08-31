import React from 'react';
import {Text, TextProps} from 'react-native';
import {useTheme} from '../../features/themes/useTheme';

export function StyledText({children, style, ...props}: TextProps) {
  const {colors} = useTheme();
  return (
    <Text style={[{fontSize: 16, lineHeight: 22, fontWeight: '400', color: colors.textOnRow}, style]} {...props}>
      {children}
    </Text>
  );
}
