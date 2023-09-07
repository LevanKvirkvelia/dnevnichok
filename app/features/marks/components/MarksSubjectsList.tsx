import React from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {usePeriodQuery} from '../hooks/usePeriodQuery';
import {ISubjectPeriod} from '../../parsers/data/types';
import {LessonsLoadingSkeleton} from '../../../shared/components/SubjectsLoadingSkeleton';
import {MarksRow} from './MarksRow';
import {useNavigation} from '@react-navigation/native';
import {Card} from '../../../ui/card/Card';
import {StyledTitle} from '../../../ui/typography/StyledTitle';
import {StyledDescription} from '../../../ui/typography/StyledDescription';
import {useQueryClient} from '@tanstack/react-query';
import {useSessionQuery} from '../../auth/components/SessionProvider';
import {useTheme} from '../../themes/useTheme';
import Color from 'color';

interface MarksSubjectsListProps {
  period: number;
}

export function MarksSubjectsList({period}: MarksSubjectsListProps) {
  const {colors} = useTheme();
  const sessionQuery = useSessionQuery();
  const {periodQuery, queryKey} = usePeriodQuery(period);
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  function getListHeaderComponent() {
    if (!periodQuery.isSuccess || !!periodQuery.data?.subjects?.length) {
      return null;
    }

    return (
      <Card style={{marginTop: 5, marginHorizontal: 5}}>
        <StyledTitle>Оценок пока нет</StyledTitle>
        <StyledDescription>Получите оценку и она здесь появится 👨‍🎓👩‍🎓</StyledDescription>
      </Card>
    );
  }

  const openItem = (lesson: ISubjectPeriod) => {
    navigation.navigate('Tabs', {
      screen: 'PeriodsTab',
      params: {
        screen: 'SubjectInfo',
        params: {subject: lesson},
      },
    });
  };

  const data =
    periodQuery.data?.subjects
      ?.filter(a => typeof a === 'object')
      .sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      }) || [];

  return periodQuery.isLoading ? (
    <LessonsLoadingSkeleton />
  ) : (
    <FlatList
      contentContainerStyle={{paddingBottom: 5}}
      data={data}
      removeClippedSubviews={false}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={periodQuery.isFetching || sessionQuery.isFetching}
          onRefresh={() => {
            if (!sessionQuery.data || sessionQuery.isError) sessionQuery.refetch({cancelRefetch: false});
            queryClient.invalidateQueries({queryKey});
          }}
          tintColor={Color(colors.textOnRow).alpha(0.5).rgb().toString()}
        />
      }
      ListHeaderComponent={getListHeaderComponent()}
      keyExtractor={(item, index) => (periodQuery.isLoading ? String(index) : item.name + period)}
      renderItem={({item}) => <MarksRow onPress={() => openItem(item)} subjectPeriod={item} />}
    />
  );
}
