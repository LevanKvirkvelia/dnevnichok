import React from 'react';
import {FlatList, Platform, Text, View} from 'react-native';
import {usePeriodQuery} from '../hooks/usePeriodQuery';
import {ISubjectPeriod} from '../../parsers/data/types';
import {LessonsLoadingSkeleton} from '../../../shared/components/SubjectsLoadingSkeleton';
import {MarksRow} from './MarksRow';
import {useNavigation} from '@react-navigation/native';
import {PeriodsTabScreenProps} from '../../../navigation/types';

interface MarksSubjectsListProps {
  period: number;
}

export function MarksSubjectsList({period}: MarksSubjectsListProps) {
  const {periodQuery} = usePeriodQuery(period);
  const navigation = useNavigation<PeriodsTabScreenProps['navigation']>();

  function getListHeaderComponent() {
    if (!periodQuery.isSuccess || !!periodQuery.data?.subjects?.length) {
      return null;
    }

    // TODO check this code
    // if (!marks) {
    //   return (
    //     <CardButton style={{margin: 5}} title="Оценок пока нет" desc="Получите оценку и она здесь появится 👨‍🎓👩‍🎓" />
    //   );
    // }

    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 20, textAlign: 'center'}}>Нет оценок. Скорее всего ваш дневник еще не заполнен</Text>
      </View>
    );
  }

  const openItem = (lesson: ISubjectPeriod) => {
    navigation.navigate('SubjectInfo', {
      subject: lesson,
    });
  };

  const data = periodQuery.data?.subjects
    ?.filter(a => typeof a === 'object')
    .sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

  return periodQuery.isLoading ? (
    <LessonsLoadingSkeleton />
  ) : (
    <FlatList
      contentContainerStyle={{paddingBottom: 5}}
      data={data}
      removeClippedSubviews={false}
      refreshing={false}
      showsVerticalScrollIndicator={false}
      onRefresh={() => periodQuery.refetch()}
      ListHeaderComponent={getListHeaderComponent()}
      keyExtractor={(item, index) => (periodQuery.isLoading ? String(index) : item.name + period)}
      renderItem={({item}) => <MarksRow onPress={() => openItem(item)} subjectPeriod={item} />}
    />
  );
}
