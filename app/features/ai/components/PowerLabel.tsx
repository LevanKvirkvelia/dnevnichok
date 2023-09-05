import React, {PropsWithChildren} from 'react';
import {Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {BonusIcon} from '../../../icons/BonusIcon';
import bonusGradient from '../assets/bonus-gradient.png';

export function PowerLabel({size = 14, children}: PropsWithChildren<{size?: number}>) {
  return (
    <View className="flex flex-row items-center justify-center shadow-black shadow-sm">
      <FastImage source={bonusGradient}>
        <View className="mr-2">
          <BonusIcon fill="white" size={size - 1} />
        </View>
        <Text style={[{color: 'white', fontSize: size, lineHeight: size * 1.1}]} className="drop-shadow-sm font-medium">
          {children}
        </Text>
      </FastImage>
    </View>
  );
}
