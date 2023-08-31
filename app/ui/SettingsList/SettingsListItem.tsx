import React, {PropsWithChildren} from 'react';
import {Text, TextProps, View} from 'react-native';
import {SettingsListRow, SettingsListRowProps} from './SettingsListRow';
import {useTheme} from '../../features/themes/useTheme';
import {IonIcon} from '../IonIcon';

function Description({children, numberOfLines}: PropsWithChildren<{numberOfLines?: number}>) {
  if (!children) return null;

  return (
    <View style={{paddingBottom: 15}}>
      {typeof children === 'string' ? (
        <Text style={{fontSize: 14, color: 'grey'}} numberOfLines={numberOfLines}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

interface SettingsListItemProps extends Pick<SettingsListRowProps, 'style' | 'dividers' | 'last' | 'onPress'> {
  icon?: string;
  rightIcon?: string;
  oneLine?: boolean;
  hasNavArrow?: boolean;
  numberOfLines?: number;
  selectable?: boolean;
  title?: React.ReactNode;
  rightText?: React.ReactNode;
  titleStyle?: TextProps['style'];
  rightTextStyle?: TextProps['style'];
  description?: React.ReactNode;
}

export function SettingsListItem({
  description = null,
  onPress,
  style,
  icon,
  title,
  titleStyle = {},
  hasNavArrow,
  oneLine = false,
  numberOfLines = oneLine ? 1 : undefined,
  rightIcon = 'chevron-forward',
  rightText,
  selectable = true,
  last,
  rightTextStyle,
  dividers,
}: SettingsListItemProps) {
  const {colors} = useTheme();

  const iconComponent =
    typeof icon === 'string' ? (
      <IonIcon
        name={icon}
        size={19}
        style={{
          color: '#aaaaaa',
          marginTop: 16,
          alignSelf: 'flex-start',
        }}
      />
    ) : (
      icon
    );

  return (
    <SettingsListRow
      last={last}
      dividers={dividers}
      style={[{paddingVertical: 0, flexDirection: 'row', alignItems: 'center', flexGrow: 1}, style]}
      onPress={onPress}>
      {iconComponent}

      <View style={{flex: 1}}>
        {typeof title === 'string' ? (
          <Text
            style={[
              {
                fontSize: 16,
                fontWeight: '400',
                paddingVertical: 15,
                paddingBottom: description ? 4 : 15,
                marginLeft: iconComponent ? 5 : 0,
                color: colors.textOnRow,
                flexShrink: 1,
                flexWrap: 'wrap',
              },
              titleStyle,
            ]}
            numberOfLines={numberOfLines}
            ellipsizeMode="tail">
            {title}
          </Text>
        ) : (
          title
        )}
        <Description numberOfLines={numberOfLines}>{description}</Description>
      </View>

      <View style={{flexShrink: 1}}>
        {typeof rightText === 'string' ? (
          <Text
            style={[
              {
                flexShrink: 1,
                alignSelf: 'flex-end',
                textAlign: 'right',
                alignItems: 'center',
                fontSize: 16,
                paddingVertical: 15,
                marginRight: 15,
                marginLeft: iconComponent ? 5 : 0,
                color: colors.textOnRow,
              },
              rightTextStyle,
            ]}
            selectable={selectable}>
            {rightText}
          </Text>
        ) : (
          rightText
        )}
      </View>

      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        {hasNavArrow || rightIcon !== 'chevron-forward' ? (
          typeof rightIcon === 'string' ? (
            <IonIcon
              name={rightIcon}
              size={20}
              style={{
                flexShrink: 1,
                color: '#aaaaaa',
                alignSelf: 'flex-end',
                textAlign: 'right',
                marginRight: 10,
              }}
            />
          ) : (
            <View style={{marginRight: 15}}>{rightIcon}</View>
          )
        ) : null}
      </View>
    </SettingsListRow>
  );
}
