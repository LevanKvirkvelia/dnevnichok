import React from 'react';
import {ScrollView, StatusBar, Text, TouchableOpacity} from 'react-native';
import Color from 'color';
import {HomeworkText} from './HomeworkText';
import {Files} from './Files';
import {useTheme} from '../../themes/useTheme';
import {SDate} from '../../auth/helpers/SDate';
import {Card} from '../../../ui/card/Card';
import {StyledTitle} from '../../../ui/typography/StyledTitle';
import {StyledText} from '../../../ui/typography/StyledText';
import {ILesson} from '../../parsers/data/types';
import {MarkWeight} from '../../../ui/MarkWeight';
import {useActiveUser} from '../../auth/hooks/useActiveUser';
import {copyHomework} from '../../../shared/helpers/clipboard';
import {GoalCard} from '../../marks/components/GoalCard';
import {useSubjectPeriodById} from '../../marks/hooks/usePeriodById';

export function LessonDiaryInfo({lesson}: {lesson: ILesson}) {
  const {colors} = useTheme();
  const user = useActiveUser();
  const subject = useSubjectPeriodById(lesson.id);
  const marks = subject?.marks.filter(mark => mark.date === lesson.date) || [];

  function renderMarks() {
    const items = marks.map((mark, i) => (
      <Card key={i}>
        <StyledTitle style={{color: colors.primary}}>
          Оценка за урок — {mark.value}
          <MarkWeight weight={mark.weight} />
        </StyledTitle>
        <StyledText>{mark.name || 'Без комментариев'}</StyledText>
      </Card>
    ));

    return items.length > 0 ? items : null;
  }

  if (!user || !lesson) return null;

  return (
    <ScrollView keyboardShouldPersistTaps="always" style={{paddingBottom: 8}}>
      <StatusBar barStyle="dark-content" backgroundColor="#c7c7c7" />

      <Text
        style={{
          marginBottom: 5,
          marginTop: 30,
          paddingHorizontal: 8,
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: 30,
          color: colors.textOnRow,
        }}>
        {lesson.name}
      </Text>
      <Text
        style={{
          marginBottom: 30,
          textAlign: 'center',
          fontSize: 16,
          color: colors.textOnRow,
        }}>
        {SDate.parseDDMMYYY(lesson.date).rus()}
        {lesson.time?.start && `, ${lesson.time.start} - ${lesson.time.end}`}
      </Text>

      {renderMarks()}
      {subject && <GoalCard showOpenPeriods subject={subject} />}
      {lesson.homework?.text ? (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => copyHomework(lesson)}
          onLongPress={() => copyHomework(lesson)}>
          <Card>
            <StyledTitle>Домашнее задание</StyledTitle>
            <StyledText>
              <HomeworkText lesson={lesson} />
            </StyledText>
          </Card>

          <Text
            style={{
              paddingHorizontal: 15,
              paddingVertical: 5,
              fontSize: 10,
              color: Color(colors.textOnRow).alpha(0.5).rgb().toString(),
            }}>
            Нажмите, чтобы скопировать ДЗ
          </Text>
        </TouchableOpacity>
      ) : null}
      <Files renderMethod="LessonDiary" lesson={lesson} />
      {lesson.theme ? (
        <Card>
          <StyledTitle>Тема урока</StyledTitle>
          <StyledText>{lesson.theme}</StyledText>
        </Card>
      ) : null}
      {lesson?.teacher?.name ? (
        <Card>
          <StyledTitle>Учитель</StyledTitle>
          <StyledText>{lesson?.teacher?.name}</StyledText>
        </Card>
      ) : null}
    </ScrollView>
  );
}
