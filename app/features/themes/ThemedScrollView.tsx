import React from 'react';
import {ScrollView, View, ViewProps} from 'react-native';
import {useTheme} from './useTheme';

export const ThemedScrollView: React.FC<ViewProps> = ({style, ...props}) => {
  const {colors} = useTheme();

  return <ScrollView {...props} style={[style, {flex: 1, backgroundColor: colors.backgroundColor}]} />;
};
