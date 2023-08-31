import React from 'react';
import {View} from 'react-native';
import {useTheme} from '../../features/themes/useTheme';

export function Divider({style = {}, size = 1}) {
  const {colors} = useTheme();

  return <View style={{height: size, backgroundColor: colors.border, width: '100%', ...style}} />;
}
