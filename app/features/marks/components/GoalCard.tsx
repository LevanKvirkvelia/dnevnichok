import {useNavigation} from '@react-navigation/native';
import color from 'color';
import {View, Text} from 'react-native';
import {Divider} from '../../../ui/SettingsList/Divider';
import {SettingsListItem} from '../../../ui/SettingsList/SettingsListItem';
import {Card} from '../../../ui/card/Card';
import {CardSettingsList} from '../../../ui/card/CardSettingsList';
import {StyledText} from '../../../ui/typography/StyledText';
import {StyledTitle} from '../../../ui/typography/StyledTitle';
import {SubjectTextAdvice} from '../../advices/SubjectTextAdvice';
import {ISubjectPeriod} from '../../parsers/data/types';
import {activeUserPeriodSelector} from '../redux/selectors';
import {RootStackScreenProps, TabsScreenProps} from '../../../navigation/types';
import {useProcessedSubjectPeriod} from '../hooks/useProccessedSubjectPeriod';
import {useActiveUser} from '../../auth/hooks/useActiveUser';

interface GoalCardProps {
  subject: ISubjectPeriod;
  showOpenPeriods?: boolean;
}

export function GoalCard({subject, showOpenPeriods = false}: GoalCardProps) {
  const navigation = useNavigation<TabsScreenProps<'PeriodsTab'>['navigation']>();
  const user = useActiveUser();
  const {average} = useProcessedSubjectPeriod(subject);

  return (
    <Card>
      <View style={{flexDirection: 'row'}}>
        <View style={{marginRight: 20}}>
          <StyledTitle>Средний балл</StyledTitle>
          <StyledText style={{color: 'green', fontSize: 50, lineHeight: 56, fontWeight: 'bold'}}>{average}</StyledText>
        </View>
        <View>
          <StyledTitle>Ваша цель</StyledTitle>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <StyledText style={{fontSize: 50, lineHeight: 56, fontWeight: 'bold', marginRight: 5}}>
              {user.settings.target}
            </StyledText>
            <Text>
              <SubjectTextAdvice subjectPeriod={subject} />
            </Text>
          </View>
        </View>
      </View>
      {showOpenPeriods && (
        <>
          <Divider style={{marginVertical: 15}} />
          <CardSettingsList>
            <SettingsListItem
              onPress={() =>
                navigation.jumpTo('PeriodsTab', {
                  screen: 'Periods',
                })
              }
              style={{marginLeft: 0}}
              titleStyle={{color: '#007AFF', fontWeight: '500'}}
              last
              title="Посмотреть все оценки"
              hasNavArrow
            />
          </CardSettingsList>
        </>
      )}
    </Card>
  );
}
