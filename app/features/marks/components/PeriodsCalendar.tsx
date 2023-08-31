import React, { useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/core';
import { Dimensions } from 'react-native';ƒ
import { futureScrollRange, pastScrollRange } from '../utils';

export type PeriodsCalendarParamList = {
	PeriodsSettings: undefined;
	PeriodsCalendar: {
		period: number;
		minDate: string;
		maxDate?: string;
		currentDate?: string;
		onAdd?(date: PeriodDate): void;
		onRemove?(): void;
	};
};

export function PeriodsCalendar() {
	const { params: { period, minDate, maxDate, currentDate, onAdd, onRemove } = {} } = useRoute<
		RouteProp<PeriodsCalendarParamList, 'PeriodsCalendar'>
	>();

	const [date, setDate] = useState<(PeriodDate & { dateString: string }) | null>(() => {
		if (!currentDate) return null;

		const dateString = new SDate(currentDate).yyyymmdd();
		const day = new Date().getDay();
		const month = new Date().getMonth() + 1;

		return { dateString, day, month };
	});

	if (!period || !minDate) {
		return (
			<ModalContainer>
				<StyledTitle style={{ marginBottom: 40 }}>Неправильный период или дата</StyledTitle>
			</ModalContainer>
		);
	}

	return (
		<ModalContainer contentStyle={{ alignItems: 'stretch' }}>
			<StyledTitle style={{ textAlign: 'center', fontSize: 18 }}>Начало {period}-го периода</StyledTitle>
			<StyledDescription style={{ textAlign: 'center', fontSize: 14 }}>
				не раньше {new SDate(minDate).rus()}
			</StyledDescription>
			<Calendar
				style={{ marginTop: 15, marginHorizontal: -5 /* to decrease paddings */ }}
				calendarWidth={Dimensions.get('window').width - /* modal padding */ 25 * 2 + /* negative margin */ 10}
				minDate={minDate}
				maxDate={maxDate}
				pastScrollRange={pastScrollRange}
				futureScrollRange={futureScrollRange}
				monthFormat="MMMM"
				onDayPress={setDate}
				markedDates={date ? { [date.dateString]: { selected: true } } : {}}
				calendarStyle={{ paddingLeft: 0, paddingRight: 0 }}
			/>
			{onAdd ? <Button text="Готово" disabled={!date} onPress={() => onAdd(date!)} fluid /> : null}
			{onRemove ? (
				<Button
					fluid
					text="Удалить период"
					style={{ marginTop: 10, backgroundColor: 'rgb(229, 231, 238)' }}
					textStyle={{ color: 'black' }}
					onPress={onRemove}
				/>
			) : null}
		</ModalContainer>
	);
}
