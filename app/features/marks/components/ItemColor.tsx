import {Text, View, ViewProps} from 'react-native';
import {ISubjectPeriod} from '../../parsers/data/types';
import {useProcessedSubjectPeriod} from '../hooks/useProccessedSubjectPeriod';
import {useTheme} from '../../themes/useTheme';

export function ItemColor({subjectPeriod, style = {}}: {subjectPeriod?: ISubjectPeriod; style?: ViewProps['style']}) {
  const {color} = useProcessedSubjectPeriod(subjectPeriod);

  return <View style={[{width: 7, maxWidth: 7, backgroundColor: color}, style]} />;
}

export function MiddleWithColor({subjectPeriod}: {subjectPeriod: ISubjectPeriod}) {
  const {styles} = useTheme();
  const {color} = useProcessedSubjectPeriod(subjectPeriod);

  return (
    <View style={styles.middleField}>
      <Text
        style={{
          ...styles.resultText,
          fontWeight: '600',
          color: color,
        }}>
        {subjectPeriod.forcedAverage ||
          subjectPeriod.marks
            .map(mark => (+mark.value * mark.weight) / subjectPeriod.marks.length)
            .reduce((a, b) => a + b, 0)}
      </Text>
      {subjectPeriod.resultMark ? <Text style={styles.resultText}>{subjectPeriod.resultMark}</Text> : null}
    </View>
  );
}
