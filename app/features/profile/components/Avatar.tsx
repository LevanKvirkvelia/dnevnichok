import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import Color from 'color';
import {useTheme} from '../../themes/useTheme';
import {User} from '../../auth/state/useUsersStore';
import FastImage from 'react-native-fast-image';
import {useMMKVBuffer, useMMKVString} from 'react-native-mmkv';
import {IonIcon} from '../../../ui/IonIcon';
import {useStoredPhotoPicker} from '../../../shared/hooks/useStoredPhotoPicker';

export type AvatarProps = {
  user: User;
  tintColor?: string;
  color?: string;
  size?: number;
  style?: any;
  showName?: boolean;
  containerStyle?: any;
  textStyle?: any;
};

export function Avatar({
  user,
  tintColor,
  color,
  size = 25,
  style = {},
  showName = true,
  containerStyle = {},
  textStyle = {},
}: AvatarProps) {
  const {colors} = useTheme();

  const name = user?.name
    ?.split(' ')
    .slice(0, 2)
    .map(v => v.slice(0, 1))
    .join('')
    .toUpperCase();

  const commonStyles = {
    width: size,
    height: size,
    borderRadius: size / 2,
    overflow: 'hidden',
    backgroundColor: tintColor || color || colors.button,
  };

  const _containerStyle = {
    margin: 15,
    marginLeft: 0,
    ...containerStyle,
  };

  const {base64Photo} = useStoredPhotoPicker(`avatar/${user.id}`);

  if (base64Photo) {
    return (
      <View style={_containerStyle}>
        <FastImage style={{...commonStyles, ...style}} source={{uri: base64Photo}} />
      </View>
    );
  }

  if (!showName) {
    return (
      <View style={_containerStyle}>
        <View
          style={{
            ...commonStyles,
            backgroundColor: '#D3D2DB',
            alignItems: 'center',
            justifyContent: 'center',
            ...style,
          }}>
          <IonIcon name="camera" size={34} color="white" />
        </View>
      </View>
    );
  }

  return (
    <View style={_containerStyle}>
      <View style={{...commonStyles, ...style}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              color: colors.textOnPrimary,
              fontSize: size / 2.2,
              fontWeight: '600',
              width: size,
              textAlign: 'center',
              ...textStyle,
            }}>
            {name}
          </Text>
        </View>
      </View>
    </View>
  );
}
