import React, {useCallback, useMemo} from 'react';
import {View, useWindowDimensions} from 'react-native';
import {useActiveUser} from '../../features/auth/hooks/useActiveUser';
import {SDate} from '../../features/auth/helpers/SDate';
import {ThemedBackgroundImage} from '../../features/themes/ThemedBackgroundImage';
import {InfiniteHorizontalScroll} from '../../features/diary/components/InfiniteHorizontalScroll';
import {useDiaryNavOptions} from '../../shared/hooks/useDiaryNavOptions';
import {DiaryHeader} from '../../features/diary/components/DiaryHeader';
import {ScheduleLessonsList} from '../../features/diary/components/ScheduleLessonsList';
import {useDiaryState} from '../../features/diary/state/useDiaryState';

const Placeholder = React.memo(() => null);

const RenderItem = React.memo(({ddmmyyyy}: {ddmmyyyy: string}) => {
  const {width} = useWindowDimensions();

  return (
    <View style={{flex: 1, width, minHeight: 100, flexGrow: 1}}>
      <ScheduleLessonsList ddmmyyyy={ddmmyyyy} />
    </View>
  );
});

export function Diary() {
  const user = useActiveUser();

  const daysRange = useMemo(() => {
    const {startDay, endDay} = SDate.getAcademicYearBoundaries();

    let range = [];
    for (let _d = startDay; _d.getTime() <= endDay.getTime(); _d = _d.getNextWorkDate(user.settings.showSaturday)) {
      range.push(_d.ddmmyyyy());
    }

    return range;
  }, [user?.settings?.showSaturday]);

  const {currentDisplayDate, setCurrentDisplayDate} = useDiaryState();

  useDiaryNavOptions({
    header: () => <DiaryHeader />,
  });

  const renderItem = useCallback((ddmmyyyy: string) => <RenderItem key={ddmmyyyy} ddmmyyyy={ddmmyyyy} />, []);
  const placeholder = useCallback(() => <Placeholder />, []);

  if (!user) {
    return null;
  }

  return (
    <ThemedBackgroundImage>
      <InfiniteHorizontalScroll
        rows={daysRange}
        current={currentDisplayDate}
        onIndexChanged={item => setCurrentDisplayDate(item as string)}
        renderItem={renderItem}
        placeholder={placeholder}
      />
    </ThemedBackgroundImage>
  );
}
