import {View, ViewProps} from 'react-native';
import {ISubjectPeriod} from '../parsers/data/types';

const COLORS = {
  good: '#32C174',
  problem: '#F64C35',
  normal: '#F69235',
  nothing: '#d8d8db',
};

export function ItemColor({subjectId, style = {}}: {subjectId: ISubjectPeriod['id']; style?: ViewProps['style']}) {
  // const { colors } = useTheme();

  // const user = useSelector(activeUserSelector);

  //   if (!user) return null;

  return (
    <View
      style={[
        {
          width: 7,
          maxWidth: 7,
          backgroundColor: COLORS.good,
        },
        style,
      ]}
    />
  );
}
