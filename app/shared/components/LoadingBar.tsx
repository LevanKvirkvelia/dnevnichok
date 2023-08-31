import React, {useState, useEffect} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {useUserPeriodsState} from '../../features/marks/state/usePeriodsState';
import {useDiaryState} from '../../features/diary/state/useDiaryState';
import {useDayScheduleQuery} from '../../features/diary/hooks/useDayScheduleQuery';
import {usePeriodQuery} from '../../features/marks/hooks/usePeriodQuery';

export function LoadingBar({track = ['diary', 'period']}: {track?: ('period' | 'diary')[]}) {
  const {activePeriodNumber} = useUserPeriodsState();
  const {currentDisplayDate} = useDiaryState();
  const diaryQuery = useDayScheduleQuery(currentDisplayDate);
  const {periodQuery} = usePeriodQuery(activePeriodNumber);

  const isLoading = track.some(item => {
    if (item === 'diary') return diaryQuery.isLoading;
    if (item === 'period') return periodQuery.isLoading;
    return false;
  });

  const hasData = track.some(item => {
    if (item === 'diary') return diaryQuery.isSuccess;
    if (item === 'period') return periodQuery.isSuccess;
    return false;
  });

  const error = track.some(item => {
    if (item === 'diary') return diaryQuery.isError;
    if (item === 'period') return periodQuery.isError;
    return false;
  });

  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState<string>('#ffcc00');
  const [text, setText] = useState<string | null>();
  const textColor = color === '#ffcc00' ? 'black' : 'white';

  useEffect(() => {
    if (!loading && isLoading) {
      setLoading(true);
      setText(hasData ? 'Обновление...' : 'Загрузка...');
      setColor('#ffcc00');
    } else if (loading && !isLoading) {
      if (error) {
        setText('Ошибка загрузки');
        setColor('#ec6045');
      } else {
        setText('Загружено!');
        setColor('#12c3bd');
      }
      const timeout = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [hasData, isLoading, error]);

  if (!loading) return null;
  return (
    <View
      style={{
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color,
      }}>
      <Text
        style={{
          color: textColor,
          flex: 1,
          marginLeft: 30,
          textAlign: 'center',
          fontWeight: '600',
          fontSize: 17,
        }}>
        {text}
      </Text>
      <ActivityIndicator style={{width: 30}} color={textColor} animating={loading} />
    </View>
  );
}
