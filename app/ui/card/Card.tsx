import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SquircleView} from 'react-native-figma-squircle';
import {useTheme} from '../../features/themes/useTheme';

export function Card({style, children}: React.PropsWithChildren<View['props']>) {
  const {colors} = useTheme();

  return (
    <SquircleView
      style={[
        {
          overflow: 'hidden',
          paddingVertical: 12,
          paddingHorizontal: 15,
        },
        {
          marginTop: 10,
          marginHorizontal: 10,
        },
        style,
        {borderRadius: undefined, backgroundColor: undefined},
      ]}
      squircleParams={{
        cornerRadius: Number(StyleSheet.flatten(style)?.borderRadius) || 8,
        cornerSmoothing: 1,
        fillColor: StyleSheet.flatten(style)?.backgroundColor || colors.rowBackgroundColor,
      }}>
      {children}
    </SquircleView>
  );
}
