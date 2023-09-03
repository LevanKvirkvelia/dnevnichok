import React, {useCallback} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useTheme} from '../../themes/useTheme';
import {usePeriodQuery} from '../hooks/usePeriodQuery';
import {PeriodsTabScreenProps} from '../../../navigation/types';
import {useUserPeriodsState} from '../state/usePeriodsState';
import {useThemedActionSheet} from '../../../shared/hooks/useActionSheet';
import {IonIcon} from '../../../ui/IonIcon';
import {periodDateToSDate} from '../utils';
import Color from 'color';

export function PeriodsHeader() {
  const {colors} = useTheme();

  const navigation = useNavigation<PeriodsTabScreenProps['navigation']>();
  const showActionSheet = useThemedActionSheet();

  const {activePeriodNumber, setActivePeriod, customPeriods, variant} = useUserPeriodsState();
  const {periodsLenQuery} = usePeriodQuery(activePeriodNumber);
  const len = periodsLenQuery.data ?? 1;
  const singlePeriod = len < 2;

  const showPeriods = useCallback(() => {
    showActionSheet([
      {text: 'Отмена', cancel: true},
      ...new Array(len)
        .fill(0)
        .map((_, num) => ({text: `${num + 1}-й период`, onPress: () => setActivePeriod(num + 1)})),
      {text: 'Настроить периоды', onPress: () => navigation.navigate('PeriodsSettings')},
    ]);
  }, [len, navigation, showActionSheet]);

  const customText = useCallback(() => {
    const startDate = customPeriods[activePeriodNumber - 1];
    const endDate = customPeriods[activePeriodNumber];

    const start = startDate ? periodDateToSDate(startDate).rus() : '1 сентября';
    const end = endDate ? periodDateToSDate(endDate).setDayPlus(-1).rus() : 'текущий день';

    return `С ${start} по ${end}`;
  }, [activePeriodNumber, customPeriods]);

  return (
    <TouchableOpacity style={{alignItems: 'center'}} onPress={showPeriods} disabled={singlePeriod}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{color: colors.textOnPrimary, fontWeight: '600', fontSize: 17, lineHeight: 20}}>
          {singlePeriod ? 'Текущий период' : `${activePeriodNumber}-й период`}
        </Text>
        {singlePeriod ? null : (
          <IonIcon name="chevron-down" size={15} color={colors.textOnPrimary} style={{marginLeft: 5}} />
        )}
      </View>
      {variant === 'custom' ? (
        <Text
          style={{
            color: Color(colors.textOnPrimary).alpha(0.5).rgb().toString(),
            fontSize: 12,
            lineHeight: 14,
            marginBottom: 8,
          }}>
          {customText()}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}
