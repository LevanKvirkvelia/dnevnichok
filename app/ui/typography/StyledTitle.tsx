import React from 'react';
import {Text, TextProps} from 'react-native';
import {useTheme} from '../../features/themes/useTheme';

export function StyledTitle({children, style, ...props}: TextProps) {
  const {colors} = useTheme();
  return (
    <Text
      style={[
        {
          fontSize: 18,
          lineHeight: 24,
          marginBottom: 5,
          color: colors.textOnRow,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
        style,
      ]}
      {...props}>
      {children}
    </Text>
  );
}
