import React, {PropsWithChildren} from 'react';
import {Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {BonusIcon} from '../../../icons/BonusIcon';
import bonusGradient from '../assets/bonus-gradient.png';

export function QuotaWidget({size = 14, children}: PropsWithChildren<{size?: number}>) {
  return (
    <View className="flex flex-row items-center justify-center shadow-black shadow-sm rounded-md mr-4">
      <FastImage source={bonusGradient} className='flex flex-row px-2 py-1 justify-center align-middle'>
        <View className="mr-2 flex justify-center align-middle">
          <BonusIcon fill="white" size={size - 1} />
        </View>
        <Text style={[{color: 'white', fontSize: size, lineHeight: size * 1.1}]} className="drop-shadow-sm font-medium">
          {children}
        </Text>
      </FastImage>
    </View>
  );
}
