import React from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import {IonIcon} from '../../../ui/IonIcon';
import {useTheme} from '../../themes/useTheme';

export function FileRow({text, onPress, iconName}: {text: string; onPress: () => void; iconName?: string}) {
  const {colors} = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: colors.fileRow || '#E3E9EE',
        borderRadius: 4,
        marginBottom: 5,
        marginRight: 5,
        alignSelf: 'flex-start',
        flexShrink: 1,
      }}>
      <View style={{flexShrink: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
        <View style={{flexShrink: 1, flexDirection: 'row', overflow: 'hidden', alignItems: 'center'}}>
          {iconName ? <IonIcon name={iconName} color={'black'} style={{marginRight: 4}} /> : null}
          <Text
            numberOfLines={1}
            ellipsizeMode="middle"
            style={{
              flexShrink: 1,
              color: colors.fileRowTextColor || 'black',
              flexWrap: 'wrap',
              fontWeight: '400',
              paddingVertical: 2,
            }}>
            {text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
