import React, {useCallback} from 'react';
import {RefreshControl, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {LessonRow} from './LessonRow';
import endent from 'endent';
import {useActiveUser} from '../../auth/hooks/useActiveUser';
import {Card} from '../../../ui/card/Card';
import {StyledTitle} from '../../../ui/typography/StyledTitle';
import {StyledText} from '../../../ui/typography/StyledText';
import {SDate} from '../../auth/helpers/SDate';
import {CardSettingsList} from '../../../ui/card/CardSettingsList';
import {SettingsListItem} from '../../../ui/SettingsList/SettingsListItem';
import {useInAppBrowser} from '../../../navigation/diary/InAppBrowser';
import {useUsersStore} from '../../auth/state/useUsersStore';
import {useDiaryState} from '../state/useDiaryState';
import {LessonsLoadingSkeleton} from '../../../shared/components/SubjectsLoadingSkeleton';
import {copyHomework} from '../../../shared/helpers/clipboard';
import {useDayScheduleQuery} from '../hooks/useDayScheduleQuery';
import {useQueryClient} from '@tanstack/react-query';
import {useSessionQuery} from '../../auth/components/SessionProvider';
import {useTheme} from '../../themes/useTheme';
import Color from 'color';
import {useMMKVBoolean} from 'react-native-mmkv';

function ListHeader() {
  const user = useActiveUser();
  const {setCurrentDisplayDate, currentDisplayDate} = useDiaryState();
  const dayQuery = useDayScheduleQuery(currentDisplayDate, {enabled: false});

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
  const {colors} = useTheme();
  const navigation = useNavigation();
  const sessionQuery = useSessionQuery();
  const {isLoading, data, refetch, isFetching, queryKey} = useDayScheduleQuery(ddmmyyyy);
  const queryClient = useQueryClient();
  const [hasShowAI = true] = useMMKVBoolean('hasShowAI');

  return (
    <View style={{flexGrow: 1}}>
      {isLoading ? (
        <LessonsLoadingSkeleton />
      ) : (
        <FlatList
          style={{flexGrow: 1}}
          contentContainerStyle={{flexGrow: 1, paddingBottom: 5}}
          ListEmptyComponent={() => <ListHeader />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching || sessionQuery.isFetching}
              onRefresh={() => {
                if (!sessionQuery.data || sessionQuery.isError) sessionQuery.refetch({cancelRefetch: false});
                queryClient.invalidateQueries({queryKey});
              }}
              tintColor={Color(colors.textOnRow).alpha(0.5).rgb().toString()}
            />
          }
          ListHeaderComponent={() =>
            hasShowAI ? (
              // @ts-ignore
              <TouchableOpacity onPress={() => navigation.navigate('AITab')}>
                <Card style={{marginTop: 5, marginHorizontal: 5}}>
                  <StyledTitle style={{marginBottom: 0}}>Мы теперь с AI!</StyledTitle>
                  <StyledText>Дневничок AI поможет с домашкой и по любым другим вопросам 🤔</StyledText>
                </Card>
              </TouchableOpacity>
            ) : null
          }
          data={data?.lessons || []}
          keyExtractor={item => `${item.name}${item.numberFrom1}`}
          renderItem={({item, index}) => (
            <LessonRow
              lesson={item}
              onCopy={() => copyHomework(item)}
              onPress={() => {
                navigation.navigate('Tabs', {
                  screen: 'DiaryTab',
                  params: {
                    screen: 'LessonInfo',
                    params: {ddmmyyyy, index},
                  },
                });
              }}
            />
          )}
        />
      )}
    </View>
  );
}
