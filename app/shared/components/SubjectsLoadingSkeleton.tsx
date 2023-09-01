import React from 'react';
import {View} from 'react-native';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {useTheme} from '../../features/themes/useTheme';

export const LessonRowLoader = React.memo(() => {
  const {colors, styles} = useTheme();

  return (
    <View style={[styles.mainWrapper, styles.largeWrapper, {borderWidth: 0}]}>
      <View style={styles.mainContainer}>
        <View style={{...styles.resultText, flex: 1, width: 7, maxWidth: 7, backgroundColor: colors.nothing}} />
        <View style={styles.contentField}>
          <ContentLoader height={55}>
            <Rect x="0" y="5" rx="3" ry="3" width="120" height="14" />
            <Rect x="0" y="28" rx="1.5" ry="1.5" width="250" height="10" />
            <Rect x="0" y="42" rx="1.5" ry="1.5" width="150" height="10" />
          </ContentLoader>
        </View>
      </View>
    </View>
  );
});

export const LessonsLoadingSkeleton = React.memo(() => {
  return (
    <>
      <LessonRowLoader />
      <LessonRowLoader />
      <LessonRowLoader />
      <LessonRowLoader />
      <LessonRowLoader />
      <LessonRowLoader />
      <LessonRowLoader />
      <LessonRowLoader />
    </>
  );
});
