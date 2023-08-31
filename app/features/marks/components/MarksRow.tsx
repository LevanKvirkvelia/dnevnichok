import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {ItemColor, MiddleWithColor} from './ItemColor';
import {useTheme} from '../../themes/useTheme';
import {ISubjectPeriod} from '../../parsers/data/types';
import {SDate} from '../../auth/helpers/SDate';
import {SubjectTextAdvice} from '../../advices/SubjectTextAdvice';

export function MarksRow({subjectPeriod, onPress}: {subjectPeriod: ISubjectPeriod; onPress: () => void}) {
  const {styles} = useTheme();
  const {id, name, marks} = subjectPeriod;

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={() => onPress()}>
      <View style={[styles.mainWrapper, styles.largeWrapper, {borderWidth: 0}]}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <ItemColor subjectId={id} />
          <View style={[styles.mainContainer, styles.contentField]}>
            <View style={{alignSelf: 'stretch', flex: 1}}>
              <Text style={[styles.title]}>{name}</Text>
              <View style={styles.list}>
                {Object.values(marks)
                  .sort((a, b) => {
                    if (a.date && b.date) {
                      return SDate.parseDDMMYYY(a.date).getTime() - SDate.parseDDMMYYY(b.date).getTime();
                    } else return 0;
                  })
                  .map((item, i) => (
                    <View key={`${name}${i}`} style={styles.periodsMarkField}>
                      <Text>
                        <Text style={styles.item}>{item.value}</Text>
                        <Text style={styles.small}>{+item.weight <= 1 ? '' : item.weight}</Text>
                      </Text>
                    </View>
                  ))}
              </View>

              <Text style={{fontWeight: '500', marginTop: 2}}>
                <SubjectTextAdvice subjectPeriod={subjectPeriod} />
              </Text>
            </View>
            <MiddleWithColor subjectPeriod={subjectPeriod} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}