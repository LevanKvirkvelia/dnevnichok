import React, {useEffect, useState} from 'react';
import {RouteProp, useRoute} from '@react-navigation/core';
import {ISubjectPeriod} from '../../features/parsers/data/types';
import {LoadingBar} from '../../shared/components/LoadingBar';
import {useDiaryNavOptions} from '../../shared/hooks/useDiaryNavOptions';
import {ThemedView} from '../../features/themes/ThemedView';
import {useActiveUser} from '../../features/auth/hooks/useActiveUser';
import {SDate} from '../../features/auth/helpers/SDate';
import {View, ScrollView, StatusBar} from 'react-native';
import {MarkWeight} from '../../ui/MarkWeight';
import {Card} from '../../ui/card/Card';
import {StyledText} from '../../ui/typography/StyledText';
import {StyledTitle} from '../../ui/typography/StyledTitle';
import {useTheme} from '../../features/themes/useTheme';
import {GoalCard} from '../../features/marks/components/GoalCard';
import {useProcessedSubjectPeriod} from '../../features/marks/hooks/useProccessedSubjectPeriod';

type SubjectInfoPageParamList = {
  SubjectInfoPage: {
    subject: ISubjectPeriod;
  };
};

export function SubjectInfoPage() {
  const route = useRoute<RouteProp<SubjectInfoPageParamList, 'SubjectInfoPage'>>();
  const {subject} = route.params;

  const {color} = useProcessedSubjectPeriod(subject);

  const user = useActiveUser();

  const {colors} = useTheme();

  useDiaryNavOptions({headerTitle: subject.name});

  function renderMarks() {
    if (!subject?.marks?.length) return null;

    const marks = subject.marks
      .sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return -SDate.parseDDMMYYY(a.date).date.getTime() + SDate.parseDDMMYYY(b.date).date.getTime();
      })
      .map((mark, index) => (
        <Card key={index}>
          <StyledTitle style={{color: colors.marks}}>
            {mark.date && `${SDate.parseDDMMYYY(mark.date).rus()} —`} {mark.value}
            <MarkWeight weight={mark.weight} />
          </StyledTitle>
          <StyledText>{mark.name || 'Без комментариев'}</StyledText>
        </Card>
      ));

    return <View>{marks}</View>;
  }

  if (!user) return null;

  return (
    <ThemedView style={{flex: 1, flexDirection: 'column'}}>
      <LoadingBar />
      <ScrollView>
        <StatusBar backgroundColor={color} />
        <GoalCard subject={subject} />
        {renderMarks()}
      </ScrollView>
    </ThemedView>
  );
}
