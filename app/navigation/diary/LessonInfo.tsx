import React from 'react';
import {Dimensions, Platform, StyleSheet, Text, View} from 'react-native';
import {useRoute} from '@react-navigation/core';
import {useTheme} from '../../features/themes/useTheme';
import {BlurView} from '@react-native-community/blur';
import {useHeaderHeight} from '@react-navigation/elements';
import {useDiaryNavOptions} from '../../shared/hooks/useDiaryNavOptions';
import {LessonDiaryInfo} from '../../features/diary/components/LessonDiaryInfo';
import {DiaryTabScreenProps, TabsScreenProps} from '../types';
import {InfiniteHorizontalScroll} from '../../features/diary/components/InfiniteHorizontalScroll';

const {width} = Dimensions.get('window');

export function LessonInfo() {
  const {colors, isDark} = useTheme();

  const {params} = useRoute<DiaryTabScreenProps<'LessionInfo'>['route']>();
  const {title, index, ddmmyyyy} = params;

  useDiaryNavOptions({
    title,
    headerStyle: {
      borderBottomWidth: 0,
      elevation: 0,
      shadowOffset: {height: 0, width: 0},
    },
    headerTruncatedBackTitle: 'Назад',
    headerBackTitle: 'Назад',
    headerTintColor: colors.textOnRow,
    ...(Platform.OS === 'ios'
      ? {
          headerTransparent: true,
          headerBackground: () => (
            <BlurView blurType={isDark ? 'dark' : 'light'} blurAmount={10} style={StyleSheet.absoluteFill} />
          ),
        }
      : {}),
  });
  const headerHeight = useHeaderHeight();

  return (
    <ThemedView style={{flex: 1, flexDirection: 'column'}}>
      {Platform.OS === 'ios' ? <View style={{height: headerHeight}} /> : null}

      <InfiniteHorizontalScroll
        current={index}
        pastScrollRange={index}
        futureScrollRange={lesson?.lessons?.length - index - 2}
        renderItem={({route: {key}}) => (
          <View style={{width, minHeight: 100}}>
            <LessonDiaryInfo ddmmyyyy={ddmmyyyy} index={key} />
          </View>
        )}
        deps={[]}
        placeholder={() => (
          <View style={{width, minHeight: 100}}>
            <Text>Loading...</Text>
          </View>
        )}
      />
    </ThemedView>
  );
}
