import React, {PureComponent} from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import {SquircleView} from 'react-native-figma-squircle';
import {IonIcon} from './IonIcon';
import {useTheme} from '../features/themes/useTheme';

export function SettingsIconWrapper({
  size = 25,
  backgroundColor,
  icon,
  iconName,
  iconStyle,
  iconSize = 20,
  iconColor,
  style = {},
}: {
  size?: number;
  backgroundColor: ViewStyle['backgroundColor'];
  icon?: React.ReactNode;
  iconName?: string;
  iconStyle?: StyleProp<TextStyle>;
  iconSize?: number;
  iconColor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const {colors} = useTheme();

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          marginRight: 10,
          overflow: 'hidden',
        },
        style,
      ]}>
      <MaskedView
        maskElement={
          <SquircleView
            style={StyleSheet.absoluteFill}
            squircleParams={{
              cornerRadius: 5,
              cornerSmoothing: 1,
            }}
          />
        }>
        <View
          style={[
            {
              width: size,
              height: size,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor,
            },
            style,
          ]}>
          {icon || (
            <IonIcon name={iconName!} style={iconStyle} size={iconSize} color={iconColor || colors.textOnPrimary} />
          )}
        </View>
      </MaskedView>
    </View>
  );
}
