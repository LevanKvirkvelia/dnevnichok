import React from 'react';
import {ActivityIndicator, Platform, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../../themes/useTheme';
import {useDiaryState} from '../state/useDiaryState';
import {SDate} from '../../auth/helpers/SDate';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NavButton} from '../../../ui/NavButton';
import {useActiveUser} from '../../auth/hooks/useActiveUser';
import {useDayScheduleQuery} from '../hooks/useDayScheduleQuery';

export function DiaryHeader() {
  const {colors} = useTheme();

  const {currentDisplayDate, setCurrentDisplayDate} = useDiaryState();
  const {top} = useSafeAreaInsets();
  const user = useActiveUser();
  const dayQuery = useDayScheduleQuery(currentDisplayDate);
  if (!currentDisplayDate) return null;
  const date = SDate.parseDDMMYYY(currentDisplayDate);

  return (
    <View
      style={Platform.select({
        ios: {
          backgroundColor: colors.primary,
          paddingTop: top,
          height: 44 + top,
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        android: {
          backgroundColor: colors.primary,
          paddingTop: 4,
          height: 56,
          shadowColor: 'black',
          shadowRadius: StyleSheet.hairlineWidth,
          shadowOpacity: 0.1,
          shadowOffset: {
            height: StyleSheet.hairlineWidth,
            width: 0,
          },
          elevation: 4,
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
      })}>
      <View style={{flex: 1, alignItems: 'flex-start'}}>
        <NavButton
          iconName="arrow-back"
          accessibilityLabel="День назад"
          size={18}
          left
          title=""
          color={colors.textOnPrimary}
          onPress={() => setCurrentDisplayDate(date.copy().getLastWorkDate(user.settings.showSaturday).ddmmyyyy())}
        />
      </View>
      <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: Platform.select({ios: 16, android: 20}),
            fontWeight: '600',
            color: colors.textOnPrimary,
          }}>
          {date.weekName() || ''}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 10,
            fontWeight: '600',
            color: colors.textOnPrimary,
            ...Platform.select({ios: {}, android: {marginTop: -2}}),
            lineHeight: 10,
          }}>
          {date.rus()}
        </Text>
      </View>
      <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
        <ActivityIndicator style={{width: 30}} color={colors.textOnPrimary} animating={!!dayQuery?.isLoading} />
        <NavButton
          iconName="arrow-forward"
          accessibilityLabel="День вперёд"
          size={18}
          color={colors.textOnPrimary}
          onPress={() => setCurrentDisplayDate(date.copy().getNextWorkDate(user.settings.showSaturday).ddmmyyyy())}
        />
      </View>
    </View>
  );
}
