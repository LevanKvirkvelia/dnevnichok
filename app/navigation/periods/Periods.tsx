import React, {useCallback, useMemo} from 'react';
import {ThemedBackgroundImage} from '../../features/themes/ThemedBackgroundImage';
import {useDiaryNavOptions} from '../../shared/hooks/useDiaryNavOptions';
import {PeriodsHeader} from '../../features/marks/components/PeriodsHeader';
import {InfiniteHorizontalScroll} from '../../features/diary/components/InfiniteHorizontalScroll';
import {usePeriodQuery} from '../../features/marks/hooks/usePeriodQuery';
import {LessonsLoadingSkeleton} from '../../shared/components/SubjectsLoadingSkeleton';
import {Dimensions, View} from 'react-native';
import {MarksSubjectsList} from '../../features/marks/components/MarksSubjectsList';
import {useUserPeriodsState} from '../../features/marks/state/usePeriodsState';

const {width} = Dimensions.get('window');

const RenderItem = React.memo(({period}: {period: number}) => (
  <View style={{width, minHeight: 100, flex: 1}}>
    <MarksSubjectsList period={period} />
  </View>
));

export function Periods() {
  const {activePeriodNumber, setActivePeriod} = useUserPeriodsState();

  const {periodsLenQuery} = usePeriodQuery(activePeriodNumber);

  useDiaryNavOptions({
    headerTitleAlign: 'center',
    headerTitle: () => <PeriodsHeader />,
    // headerRight: () => (
    //   <NavButton
    //     color={colors.textOnPrimary}
    //     style={{padding: 10}}
    //     iconName="settings-sharp"
    //     size={22}
    //     onPress={() => navigation.navigate('PeriodsSettings')}
    //   />
    // ),
  });

  const len = periodsLenQuery.data || 1;

  const onPageChange = useCallback(
    (index: number) => {
      console.log('onPageChange', index);
      if (index !== activePeriodNumber) {
        const validPeriod = Math.max(Math.min(index, len), 1);

        setActivePeriod(validPeriod);
      }
    },
    [activePeriodNumber],
  );

  const renderItem = useCallback((item: number) => <RenderItem period={item} />, []);
  const placeholder = useCallback(() => <LessonsLoadingSkeleton />, []);
  const rows = useMemo(() => new Array(len).fill(0).map((_, i) => i + 1), [len]);

  return (
    <ThemedBackgroundImage>
      <InfiniteHorizontalScroll
        rows={rows}
        current={activePeriodNumber}
        onIndexChanged={item => onPageChange(+item)}
        placeholderDist={0}
        renderItem={renderItem}
        placeholder={placeholder}
      />
    </ThemedBackgroundImage>
  );
}
