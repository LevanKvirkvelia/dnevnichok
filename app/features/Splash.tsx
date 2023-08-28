import React from 'react';
import {Text, View} from 'react-native';
import {Config} from './config';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from './themes/useTheme';

interface SplashProps {
  loveText?: React.ReactNode;
}

export function Splash({
  children,
  loveText = 'Создано независимыми разработчиками\nиз любви к образованию',
}: React.PropsWithChildren<SplashProps>) {
  const {colors} = useTheme();

  return (
    <View
      className={'flex-1 flex-col'}
      style={{
        backgroundColor: colors.primary,
      }}>
      <View className="flex-1 items-center justify-center mt-36">
        <FastImage source={Config.logo} className="w-40 rounded-3xl h-40" />
        <Text className="bg-transparent text-white text-5xl text-center font-normal mt-4 px-5">
          Дневничок
        </Text>
      </View>
      {children}
      <SafeAreaView className="flex items-center justify-end flex-1 pb-5">
        <Text className="bg-transparent text-white text-16 text-center font-500 px-5">
          {loveText}
        </Text>
      </SafeAreaView>
    </View>
  );
}
