import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from './useTheme';
import {useStoredPhotoPicker} from '../../shared/hooks/useStoredPhotoPicker';
import {IonIcon} from '../../ui/IonIcon';
import FastImage from 'react-native-fast-image';

export function BackgroundPreview({
  bgName,
  size = 25,
  margin = 0,
  showActive = true,
}: {
  bgName?: string;
  size?: number;
  margin?: number;
  showActive?: boolean;
}) {
  const {backgroundNameOrUrl, colors} = useTheme();
  const {base64Photo} = useStoredPhotoPicker('background');

  const icon = (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <IonIcon name="checkmark" size={size} style={{color: colors.border}} />
    </View>
  );
  const cf = 1920 / 1080;
  return (
    <View
      style={{
        width: size,
        height: cf * size,
        margin,
        borderRadius: 8,
        backgroundColor: colors.backgroundColor,
      }}>
      <FastImage
        source={{uri: bgName == 'custom' ? base64Photo : bgName}}
        style={{
          width: size,
          height: cf * size,
          opacity: bgName === backgroundNameOrUrl && showActive ? 0.5 : 1,
          borderRadius: 8,
        }}
        resizeMode="cover"
      />

      {bgName === backgroundNameOrUrl && showActive && icon}
    </View>
  );
}
