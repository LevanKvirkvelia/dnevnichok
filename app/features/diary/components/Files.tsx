import React from 'react';
import {View} from 'react-native';
import {useInAppBrowser} from '../../../navigation/InAppBrowser';
import {Card} from '../../../ui/card/Card';
import {Divider} from '../../../ui/settingsList/Divider';
import {StyledTitle} from '../../../ui/typography/StyledTitle';
import {StyledDescription} from '../../../ui/typography/StyledDescription';
import {CardSettingsList} from '../../../ui/card/CardSettingsList';
import {SettingsListItem} from '../../../ui/SettingsList/SettingsListItem';
import {IAttachment, ILesson} from '../../parsers/data/types';
import {FileRow} from './FileRow';
import {useOptimisticOpenLink} from '../../../shared/hooks/useOptimisticOpenLink';

export function Files({
  lesson,
  onPress,
  renderMethod = 'card',
}: {
  lesson: ILesson;
  onPress?: () => void;
  renderMethod?: string;
}) {
  const openLink = useOptimisticOpenLink();
  // TODO refreshLink
  //   const refreshLink = useRefreshMosLink();

  const _attachments = lesson.homework?.attachments || [];

  const attachments: (IAttachment & {iconName?: string})[] =
    lesson?.extras?.realId && renderMethod === 'LessonDiary'
      ? [
          {
            link: `https://dnevnik.mos.ru/conference/?scheduled_lesson_id=${lesson?.extras?.realId}`,
            title: 'MS Teams',
            iconName: 'videocam-outline',
          },
          ..._attachments,
        ]
      : _attachments;

  if (!attachments.length) return null;

  if (renderMethod === 'LessonDiary') {
    return (
      <Card>
        <StyledTitle>Прикрепленные материалы</StyledTitle>
        <StyledDescription>Учитель добавил их к домашнему заданию</StyledDescription>
        <Divider style={{marginVertical: 10}} />
        <CardSettingsList style={{marginVertical: 0, marginBottom: -12, marginTop: -10}}>
          {attachments.map(a => (
            <SettingsListItem
              titleStyle={{color: '#007AFF'}}
              key={a.link}
              onPress={() => openLink(a.link)}
              icon={a.iconName || 'attach'}
              title={a.title}
              hasNavArrow
            />
          ))}
        </CardSettingsList>
      </Card>
    );
  }

  return (
    <View style={{marginTop: 5, flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
      {attachments.slice(0, 2).map(attachment => (
        <FileRow
          key={attachment.link}
          text={attachment.title}
          iconName={attachment.iconName}
          onPress={() => openLink(attachment.link)}
        />
      ))}
      {attachments.length > 2 && onPress && (
        <FileRow key="more" text={`ещё + ${attachments.length - 2}`} onPress={onPress} />
      )}
    </View>
  );
}
