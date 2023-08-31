import React from 'react';
import {View, ViewProps} from 'react-native';
import {useTheme} from './useTheme';

export function ThemedView(props: ViewProps) {
  const {colors} = useTheme();

  const {style, ...restProps} = props;

  return <View {...restProps} style={[style, {flex: 1, backgroundColor: colors.backgroundColor}]} />;
}
