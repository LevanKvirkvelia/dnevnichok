import React from 'react';
import {FlatList, Platform, Text, View} from 'react-native';
import {usePeriodQuery} from '../hooks/usePeriodQuery';
import {ISubjectPeriod} from '../../parsers/data/types';
import {LessonsLoadingSkeleton} from '../../../shared/components/SubjectsLoadingSkeleton';
import {MarksRow} from './MarksRow';
import {useNavigation} from '@react-navigation/native';
import {PeriodsTabScreenProps} from '../../../navigation/types';
import {IonIcon} from '../../../ui/IonIcon';
import {useTheme} from '../../themes/useTheme';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {LoadingBar} from '../../../shared/components/LoadingBar';

interface MarksSubjectsListProps {
  period: number;
}
// todo remove from here
export function CardButton(props) {
  const {onPress, style = {}, title, desc, icon} = props;
  const {colors, styles, theme, isDark} = useTheme();
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={() => onPress && onPress()}>
      <View
        style={[
          styles.mainContainer,
          styles.mainWrapper,
          {
            backgroundColor: colors.rowBackgroundColor,
          },
          style,
        ]}>
        <View style={[styles.contentField, {padding: 10}]}>
          <View style={styles.listNoteButton}>
            <Text style={styles.titleAlpha}>{title}</Text>
          </View>
          {desc ? (
            <View style={styles.listNoteButton}>
              <Text style={styles.subtitle}>{desc}</Text>
            </View>
          ) : null}
        </View>
        {onPress ? (
          <View style={styles.arrowFieldNoteButton}>
            <IonIcon
              name={icon || 'add-outline'}
              style={{color: isDark ? colors.textOnPrimary : colors.primary}}
              size={30}
            />
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export function MarksSubjectsList({period}: MarksSubjectsListProps) {
  const {periodQuery} = usePeriodQuery(period);
  const navigation = useNavigation<PeriodsTabScreenProps['navigation']>();

  function getListHeaderComponent() {
    if (!periodQuery.isSuccess || !!periodQuery.data?.subjects?.length) {
      return null;
    }

    return <CardButton style={{margin: 5}} title="Оценок пока нет" desc="Получите оценку и она здесь появится 👨‍🎓👩‍🎓" />;
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
      refreshing={periodQuery.isFetching}
      showsVerticalScrollIndicator={false}
      onRefresh={() => periodQuery.refetch()}
      ListHeaderComponent={getListHeaderComponent()}
      keyExtractor={(item, index) => (periodQuery.isLoading ? String(index) : item.name + period)}
      renderItem={({item}) => <MarksRow onPress={() => openItem(item)} subjectPeriod={item} />}
    />
  );
}
