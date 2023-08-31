import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Text, TouchableOpacity, ScrollView, Switch} from 'react-native';
import {PeriodsCalendarParamList} from '../../features/marks/components/PeriodsCalendar';
import {periodVariants, periodDateToSDate} from '../../features/marks/utils';
import {ThemedView} from '../../features/themes/ThemedView';
import {useDiaryNavOptions} from '../../shared/hooks/useDiaryNavOptions';
import {CloseButton} from '../../ui/CloseButton';
import {Divider} from '../../ui/SettingsList/Divider';
import {Card} from '../../ui/card/Card';
import {StyledDescription} from '../../ui/typography/StyledDescription';
import {StyledText} from '../../ui/typography/StyledText';
import {StyledTitle} from '../../ui/typography/StyledTitle';
import {useTheme} from '../../features/themes/useTheme';
import {useMMKVBoolean} from 'react-native-mmkv';
import {useActiveUser} from '../../features/auth/hooks/useActiveUser';
import {SwipeToDelete} from '../../ui/SwipeToDelete';
import {Button} from '../../ui/Button';
import {SwitchItem} from '../../ui/Switch';
import {PeriodDate, useUserPeriodsState} from '../../features/marks/state/usePeriodsState';

function getMaxDate(date?: PeriodDate) {
  if (!date) return;
  return periodDateToSDate(date).yyyymmdd();
}
function getMinDate(date: PeriodDate) {
  return periodDateToSDate(date).setDayPlus(1).yyyymmdd();
}

export function PeriodsOnboarding() {
  const {colors} = useTheme();

  const [seenOnboarding = false, setSeenOnboarding] = useMMKVBoolean('seenPeriodSettingsOnboarding');
  const close = () => setSeenOnboarding(true);

  if (seenOnboarding) return null;

  return (
    <Card style={{alignItems: 'center', paddingHorizontal: 20, paddingVertical: 25}}>
      <CloseButton position="absolute" onPress={close} />
      <Text style={{fontSize: 90}}>🎲</Text>
      <StyledTitle style={{marginTop: 15, textAlign: 'center', fontSize: 18}}>Настройте периоды для оценок</StyledTitle>
      <StyledDescription style={{marginTop: 5, textAlign: 'center', fontSize: 16}}>
        В школах оценки выставляют за разные периоды — полугодия или четверти.{'\n'}
        Теперь их можно настроить под себя
      </StyledDescription>
      <TouchableOpacity onPress={close}>
        <Text style={{marginTop: 15, fontSize: 16, color: colors.linkColor, fontWeight: '500'}}>Спасибо, понятно</Text>
      </TouchableOpacity>
    </Card>
  );
}

export function PeriodsSettings() {
  useDiaryNavOptions({title: 'Периоды', headerTitleAlign: 'center'});

  const navigation = useNavigation<StackNavigationProp<PeriodsCalendarParamList, 'PeriodsCalendar'>>();
  const user = useActiveUser();
  const {variant, setVariant, customPeriods, setCustomPeriods} = useUserPeriodsState();

  const automaticText = `Также, как на сайте "${user?.engine}"`;

  const onAdd = (date: PeriodDate, index: number) => {
    const newPeriods = [...customPeriods];
    newPeriods.splice(index, 0, date);
    setCustomPeriods(newPeriods);
    requestAnimationFrame(() => navigation.navigate('PeriodsSettings'));
  };

  return (
    <ThemedView>
      <ScrollView>
        <PeriodsOnboarding />
        <Card style={{paddingVertical: 15, paddingHorizontal: 0, marginBottom: 15}}>
          <Switch style={{marginHorizontal: 15}}>
            {periodVariants.map(p => {
              const active = p.key === variant;

              return (
                <SwitchItem
                  key={p.key}
                  onPress={() => setVariant(p.key)}
                  style={{flex: 1, paddingVertical: 8, backgroundColor: active ? 'white' : undefined}}>
                  <Text
                    key={String(active)}
                    numberOfLines={1}
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: active ? undefined : 'rgb(119,118,126)',
                    }}>
                    {p.name}
                  </Text>
                </SwitchItem>
              );
            })}
          </Switch>
          {variant === 'automatic' ? (
            <StyledText style={{textAlign: 'center', marginTop: 15, fontSize: 16}}>{automaticText}</StyledText>
          ) : null}
          {variant === 'custom' ? (
            <>
              {customPeriods.map((date, index) => {
                const isFirst = index === 0;

                const onRemove = () => {
                  setCustomPeriods(customPeriods.filter((_, i) => i !== index));
                  requestAnimationFrame(() => navigation.navigate('PeriodsSettings'));
                };

                return (
                  <React.Fragment key={index}>
                    {isFirst ? null : <Divider style={{marginLeft: 15}} />}
                    <SwipeToDelete
                      disabled={isFirst}
                      onDelete={onRemove}
                      style={{marginHorizontal: 15, marginTop: 15, marginBottom: 15, opacity: isFirst ? 0.6 : 1}}>
                      <TouchableOpacity
                        disabled={isFirst}
                        onPress={() =>
                          navigation.navigate('PeriodsCalendar', {
                            period: index + 1,
                            minDate: getMinDate(customPeriods[index - 1]),
                            maxDate: getMaxDate(customPeriods[index + 1]),
                            currentDate: periodDateToSDate(date).yyyymmdd(),
                            onAdd: d => onAdd(d, index),
                            onRemove,
                          })
                        }>
                        <StyledTitle style={{fontSize: 18}}>{index + 1}-й период</StyledTitle>
                        <StyledText>Начинается с {periodDateToSDate(date).rus()}</StyledText>
                      </TouchableOpacity>
                    </SwipeToDelete>
                  </React.Fragment>
                );
              })}
              <Button
                style={{marginHorizontal: 15, marginTop: 15}}
                text="+ Создать следующий период"
                onPress={() =>
                  navigation.navigate('PeriodsCalendar', {
                    period: customPeriods.length + 1,
                    minDate: getMinDate(customPeriods[customPeriods.length - 1]),
                    onAdd: d => onAdd(d, customPeriods.length),
                  })
                }
              />
            </>
          ) : null}
        </Card>
      </ScrollView>
    </ThemedView>
  );
}
