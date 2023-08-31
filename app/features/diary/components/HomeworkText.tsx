import React from 'react';
import {Text} from 'react-native';
import Typograf from 'typograf';
import {useTheme} from '../../themes/useTheme';
import {useOptimisticOpenLink} from '../../../shared/hooks/useOptimisticOpenLink';
import {TextStyle} from 'react-native';
import {ILesson} from '../../parsers/data/types';

const tp = new Typograf({locale: ['ru', 'en-US']});
tp.disableRule('common/html/*');
tp.disableRule('common/punctuation/quote');

const regexUrl =
  /https?:\/\/(www\.)?[-a-zA-Zа-яА-Я0-9@:%._\+~#=]{1,256}\.[a-zA-Zа-яА-Я0-9()]{1,6}\b([-a-zA-Zа-яА-Я0-9()@:%_\+.~#?&\/\/=]*)/;
const regexEMail = /[a-z0-9!#$%&'*+=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*/i;
const regexPhone = /(8|\+7|7)([\- ]?)?(\(?\d{3}\)?[\- ]?)[\d\- ]{7,10}/;
/*
	Мы можем исключать определённые домены. Пример для youtube:
	/^https?\:\/\/(?!(?:www\.)?(?:youtube\.com|youtu\.be))([^\/:?#]+)(?:[\/:?#]|$)/i
 */
const regexDomain = /^https?\:\/\/(?:www\.)?([^\/:?#]+)(?:[\/:?#]|$)/i;
const regexMesh = /(мэш|московск.. электронн.. школ.)/i;
const regexResh = /(рэш|российск.. электронн.. школ.)/i;

const expressions = [
  {expression: regexUrl, type: 'link'},
  {expression: regexEMail, type: 'email'},
  {expression: regexPhone, type: 'phone'},
  {expression: regexMesh, type: 'mesh'},
  {expression: regexResh, type: 'resh'},
];

function createElement(text: string, match: RegExpMatchArray, tag: string): [string, string][] {
  return [
    ...splitLink(text.slice(0, match.index)),
    [match[0], tag] as [string, string],
    ...splitLink(text.slice(match.index! + match[0].length)),
  ].filter(a => !!a?.[0]);
}

function splitLink(t: string): [string, string][] {
  const match = expressions.find(expression => t.match(expression.expression));
  if (match) return createElement(t, t.match(match.expression)!, match.type);
  return [[t, 'text'] as [string, string]].filter(a => !!a?.[0]);
}

export function HomeworkText({
  lesson,
  style = {},
  cutUrls = false,
}: {
  lesson: ILesson;
  style?: TextStyle;
  cutUrls?: boolean;
}) {
  // const refreshLink = useRefreshMosLink();

  const openLink = useOptimisticOpenLink();

  const {colors} = useTheme();
  const hw = tp.execute(lesson.homework?.text || '');
  const texts = splitLink(hw);

  const styledTexts = texts.map((t, i) => {
    const key = lesson.id + t[0] + i;
    if (t[1] === 'text')
      return (
        <Text key={key} style={[{...style, color: colors.textOnRow}]}>
          {t[0]}
        </Text>
      );

    if (t[1] === 'link') {
      return (
        <Text
          key={key}
          onPress={() => openLink(t[0])}
          style={{
            ...style,
            color: colors.linkColor,
            textDecorationLine: 'underline',
            textDecorationStyle: 'solid',
          }}>
          {t[0].match(regexDomain)?.[1] && cutUrls ? `(${t[0].match(regexDomain)![1]})` : t[0]}
        </Text>
      );
    }
    if (t[1] === 'email') {
      return (
        <Text
          key={key}
          onPress={() => openLink(`mailto:${t[0]}`)}
          style={{
            ...style,
            color: colors.linkColor,
            textDecorationLine: 'underline',
            textDecorationStyle: 'solid',
          }}>
          {t[0]}
        </Text>
      );
    }
    if (t[1] === 'phone') {
      return (
        <Text
          key={key}
          onPress={() =>
            openLink(
              `https://wa.me/${t[0]
                .replace(/[^0-9]/g, '')
                .replace(/^8/, '+7')
                .replace(/^7/, '+7')}`,
            )
          }
          style={{
            ...style,
            color: colors.linkColor,
            textDecorationLine: 'underline',
            textDecorationStyle: 'solid',
          }}>
          {t[0]}
        </Text>
      );
    }
    if (t[1] === 'mesh') {
      return (
        <Text
          key={key}
          onPress={() => {
            openLink(`https://uchebnik.mos.ru`);
          }}
          style={{
            ...style,
            color: colors.linkColor,
            textDecorationLine: 'underline',
            textDecorationStyle: 'solid',
          }}>
          {t[0]}
        </Text>
      );
    }
    if (t[1] === 'resh') {
      return (
        <Text
          key={key}
          onPress={() => {
            const link = `https://resh.edu.ru/`;
            openLink(link);
          }}
          style={{
            ...style,
            color: colors.linkColor,
            textDecorationLine: 'underline',
            textDecorationStyle: 'solid',
          }}>
          {t[0]}
        </Text>
      );
    }

    return null;
  });

  return <Text style={lesson.homework?.text ? {} : {display: 'none'}}>{styledTexts}</Text>;
}
