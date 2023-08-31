import React from 'react';
import {Text, Image, View, TouchableOpacity} from 'react-native';
import door from '../assets/door.png';
import {ILesson} from '../../parsers/data/types';
import {useTheme} from '../../themes/useTheme';
import {StyledDescription} from '../../../ui/typography/StyledDescription';
import {HomeworkText} from './HomeworkText';
import {Files} from './Files';
import {ItemColor} from '../../advices/ItemColor';

const Touchable = TouchableOpacity;

export function LessonRow({onPress, lesson, onCopy}: {onPress(): void; lesson: ILesson; onCopy(): void}) {
  const {styles, colors} = useTheme();
  const rm0 = (s = '') => (s.slice(0, 1) === '0' ? s.slice(1) : s);

  return (
    <Touchable onPress={onPress} delayLongPress={1000} onLongPress={onCopy}>
      <View
        style={[
          styles.mainWrapper,
          styles.largeWrapper,
          {borderWidth: 0, marginBottom: 0},
          {
            alignSelf: 'stretch',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            flexDirection: 'row',
          },
        ]}>
        <ItemColor subjectId={lesson.id} />

        <View style={styles.numberField}>
          <Text style={styles.lessonNum}>{lesson.number}</Text>
        </View>

        <View style={styles.contentField}>
          <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
            <View
              style={{
                flexShrink: 1,
                paddingRight: 10,
              }}>
              <Text>
                <Text style={styles.title}>
                  {`${lesson.name}`}
                  {'\u00A0\u00A0'}
                </Text>
                {lesson.location ? <Image style={{height: 13, width: 8}} resizeMode="contain" source={door} /> : null}
                {lesson.location ? (
                  <StyledDescription style={{marginTop: 0, marginLeft: 5}} numberOfLines={1}>
                    {'\u00A0'}
                    {lesson.location}
                  </StyledDescription>
                ) : null}
              </Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              {!lesson?.marks?.length && !lesson.missed && lesson.time?.start ? (
                <Text style={styles.time}>{`${rm0(lesson.time.start)} - ${rm0(lesson.time.end)}`}</Text>
              ) : null}
              {lesson?.marks?.map((item, _i) => (
                <View key={`${lesson.date}${lesson.id}${_i}`} style={styles.diaryMarkField}>
                  {item.point && <Text style={{...styles.item, fontSize: 18}}>•</Text>}
                  {!item.point && <Text style={styles.item}>{item.value}</Text>}
                  {lesson.marks?.length === _i + 1 && +item.weight <= 1 ? null : (
                    <Text style={[styles.small, +item.weight <= 1 ? {color: colors.rowBackgroundColor} : {}]}>
                      {+item.weight <= 1 ? 1 : item.weight}
                    </Text>
                  )}
                </View>
              ))}
              {lesson.missed ? (
                <View style={styles.diaryMarkField}>
                  <Text style={{...styles.item, fontSize: 18}}>н</Text>
                </View>
              ) : null}
            </View>
          </View>
          <HomeworkText lesson={lesson} style={styles.textOnRow} cutUrls />
          <Files lesson={lesson} onPress={onPress} />
        </View>
      </View>
    </Touchable>
  );
}
