import React from 'react';
import {Text, View} from 'react-native';
import {useTheme} from '../../themes/useTheme';
import {useAuthFormStore} from '../state/useAuthFormStore';
import FastImage from 'react-native-fast-image';
import {IonIcon} from '../../../ui/IonIcon';
import {WORKERS} from '../../parsers/Workers';
import {EngineNames} from '../../parsers/getParser';
import {TouchableOpacity} from 'react-native-gesture-handler';

export function EngineList({onNavigate}: {onNavigate(engine: EngineNames): void}) {
  const {colors} = useTheme();

  const engines = Object.values(WORKERS).filter((w): w is NonNullable<typeof w> => !!w);

  const {setEngine} = useAuthFormStore();

  return (
    <>
      {engines.map((engine, index) => {
        return (
          <TouchableOpacity
            key={engine.name}
            onPress={() => {
              setEngine(engine.name);
              if (onNavigate) onNavigate(engine.name);
            }}
            className="flex-row justify-center items-center py-4 px-5"
            style={{
              borderColor: colors.border,
              borderTopWidth: index ? 1 : 0,
            }}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <FastImage source={engine.logo!} style={{width: 38, height: 38}} resizeMode="contain" />
              <View style={{marginLeft: 12}}>
                <Text
                  style={{
                    color: colors.textOnRow,
                    fontSize: 16,
                    lineHeight: 22,
                  }}>
                  {engine.name}
                </Text>
                {engine.subTitle ? (
                  <Text style={{color: '#818388', fontSize: 12, lineHeight: 14}}>{engine.subTitle}</Text>
                ) : null}
              </View>
            </View>
            <IonIcon name="chevron-forward" style={{marginLeft: 10}} size={25} color="#BCBEC6" />
          </TouchableOpacity>
        );
      })}
    </>
  );
}
