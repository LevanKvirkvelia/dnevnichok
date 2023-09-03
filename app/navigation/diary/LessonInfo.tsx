import React, {useMemo, useState} from 'react';
import {Dimensions, Platform, StyleSheet, Text, View} from 'react-native';
import {useRoute} from '@react-navigation/core';
import {useTheme} from '../../features/themes/useTheme';
import {BlurView} from '@react-native-community/blur';
import {useHeaderHeight} from '@react-navigation/elements';
import {useDiaryNavOptions} from '../../shared/hooks/useDiaryNavOptions';
import {LessonDiaryInfo} from '../../features/diary/components/LessonDiaryInfo';
import {DiaryTabScreenProps, TabsScreenProps} from '../types';
import {InfiniteHorizontalScroll} from '../../features/diary/components/InfiniteHorizontalScroll';
import {ThemedView} from '../../features/themes/ThemedView';
import {useDayScheduleQuery} from '../../features/diary/hooks/useDayScheduleQuery';

const {width} = Dimensions.get('window');

export function LessonInfo() {
  const {colors, isDark} = useTheme();

  const route = useRoute<DiaryTabScreenProps<'LessonInfo'>['route']>();
  const {index, ddmmyyyy} = route.params;

  const dayQuery = useDayScheduleQuery(ddmmyyyy);

  const rows = useMemo(() => {
    return new Array(dayQuery.data?.lessons.length).fill(0).map((_, i) => i) || 0;
  }, [dayQuery.data?.lessons.length]);

  useDiaryNavOptions({
    headerTitle: '',
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
          // headerBackground: () => (
          //   <BlurView blurType={isDark ? 'dark' : 'light'} blurAmount={10} style={StyleSheet.absoluteFill} />
          // ),
        }
      : {}),
  });
  const headerHeight = useHeaderHeight();

  return (
    <ThemedView style={{flex: 1, flexDirection: 'column'}}>
      {Platform.OS === 'ios' ? <View style={{height: headerHeight}} /> : null}

      <InfiniteHorizontalScroll
        current={index}
        rows={rows}
        renderItem={(key: number) => (
          <View style={{width, flex: 1, minHeight: 100}}>
            <LessonDiaryInfo lesson={dayQuery.data?.lessons[key]!} />
          </View>
        )}
        placeholder={() => (
          <View style={{width, minHeight: 100}}>
            <Text>Loading...</Text>
          </View>
        )}
      />
    </ThemedView>
  );
}
