import React, {useCallback} from 'react';
import {RefreshControl, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {FlatList} from 'react-native-gesture-handler';
import {LessonRow} from './LessonRow';
import endent from 'endent';
import {useActiveUser} from '../../auth/hooks/useActiveUser';
import {Card} from '../../../ui/card/Card';
import {StyledTitle} from '../../../ui/typography/StyledTitle';
import {StyledText} from '../../../ui/typography/StyledText';
import {SDate} from '../../auth/helpers/SDate';
import {CardSettingsList} from '../../../ui/card/CardSettingsList';
import {SettingsListItem} from '../../../ui/SettingsList/SettingsListItem';
import {useInAppBrowser} from '../../../navigation/InAppBrowser';
import {useUsersStore} from '../../auth/state/useUsersStore';
import {useDiaryState} from '../state/useDiaryState';
import {LessonsLoadingSkeleton} from '../../../shared/components/SubjectsLoadingSkeleton';
import {DiaryTabScreenProps, TabsScreenProps} from '../../../navigation/types';
import {copyHomework} from '../../../shared/helpers/clipboard';
import {IDaySchedule} from '../../parsers/data/types';
import {useDayScheduleQuery} from '../hooks/useDayScheduleQuery';

function ListHeader() {
  const user = useActiveUser();
  const {setCurrentDisplayDate, currentDisplayDate} = useDiaryState();
  const dayQuery = useDayScheduleQuery(currentDisplayDate);

  const {setUserSettings} = useUsersStore();
  const openInAppBrowser = useInAppBrowser();

  let desc = endent`
  Такое бывает, когда школа еще не заполнила дневник️ или во время каникул
  
  Если расписание есть на сайте "${user?.engine}", переустановите приложение или напишите в поддержку
  `;

  const noLessons = !dayQuery.data?.lessons?.length && !dayQuery?.isLoading;
  const sDate = SDate.parseDDMMYYY(currentDisplayDate);
  return noLessons ? (
    <Card style={{marginHorizontal: 5, marginTop: 5}}>
      <StyledTitle>Нет расписания</StyledTitle>
      <StyledText>{desc}</StyledText>

      <CardSettingsList dividerTop>
        {sDate?.getWeekDayNum() === 6 ? (
          <SettingsListItem
            title="Отключить субботу"
            titleStyle={{color: '#007AFF'}}
            onPress={() => {
              setUserSettings({showSaturday: !user.settings?.showSaturday});
              setCurrentDisplayDate(sDate.copy().getNextWorkDate(user.settings.showSaturday).ddmmyyyy());
            }}
            hasNavArrow
          />
        ) : null}
        <SettingsListItem
          title="Проверить на сайте"
          titleStyle={{color: '#007AFF'}}
          onPress={() => {
            openInAppBrowser();
          }}
          hasNavArrow
        />
      </CardSettingsList>
    </Card>
  ) : null;
}

export function ScheduleLessonsList({ddmmyyyy}: {ddmmyyyy: string}) {
  const navigation = useNavigation<DiaryTabScreenProps['navigation']>();
  const user = useActiveUser();
  const {isLoading, data, refetch} = useDayScheduleQuery(ddmmyyyy);

  return (
    <View style={{flexGrow: 1}}>
      {isLoading ? (
        <LessonsLoadingSkeleton />
      ) : (
        <FlatList
          style={{flexGrow: 1}}
          contentContainerStyle={{flexGrow: 1, paddingBottom: 5}}
          ListEmptyComponent={ListHeader}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={false} onRefresh={() => refetch()} />}
          data={data?.lessons || []}
          keyExtractor={item => `${item.name}${item.number}`}
          renderItem={({item, index}) => (
            <LessonRow
              lesson={item}
              onCopy={() => copyHomework(item)}
              onPress={() => {
                navigation.push('LessionInfo', {title: 'Расписание', ddmmyyyy, index});
              }}
            />
          )}
        />
      )}
    </View>
  );
}
