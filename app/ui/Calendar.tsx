import React from 'react';
import Color from 'color';
import {ViewStyle} from 'react-native';
import {CalendarList, CalendarListProps, LocaleConfig} from 'react-native-calendars';
import {useTheme} from '../features/themes/useTheme';
import {SDate} from '../features/auth/helpers/SDate';

LocaleConfig.locales.ru = {
  monthNames: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthNamesShort: ['Янв.', 'Фев.', 'Мар.', 'Апр.', 'Май', 'Июн.', 'Июл.', 'Авг', 'Сент.', 'Окт.', 'Нояб.', 'Дек.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
};
LocaleConfig.defaultLocale = 'ru';

export type CalendarProps = CalendarListProps & {calendarStyle: ViewStyle};

export function Calendar(props: CalendarProps) {
  const {colors} = useTheme();

  return (
    <CalendarList
      horizontal
      pagingEnabled
      minDate={new SDate().yyyymmdd()}
      hideArrows={false}
      pastScrollRange={0}
      futureScrollRange={2}
      scrollEnabled
      showScrollIndicator={false}
      firstDay={1}
      theme={{
        backgroundColor: colors.rowBackgroundColor,
        calendarBackground: colors.rowBackgroundColor,
        textSectionTitleColor: colors.textOnRow,
        textDisabledColor: Color(colors.textOnRow).alpha(0.21).rgb().toString(),
        arrowColor: colors.activeTab,
        selectedDayBackgroundColor: colors.activeTab,
        selectedDayTextColor: colors.textOnPrimary,
        dayTextColor: colors.textOnRow,
        monthTextColor: colors.textOnRow,
        todayTextColor: colors.activeTab,
        textMonthFontWeight: '500',
      }}
      {...props}
    />
  );
}
