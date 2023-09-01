import React from 'react';
import {Text, View} from 'react-native';
import {useOTAState} from '../state/useOTAState';

export function OTAProgressBar() {
  const {isLoading, progress} = useOTAState();
  if (!isLoading) return null;
  return (
    <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 30}}>
      <View style={{flex: 0.6}}>
        <View
          style={{
            borderRadius: 5,
            height: 11,
            backgroundColor: 'rgba(0,0,0,0.5)',
            flexDirection: 'row',
          }}>
          <View
            style={{
              borderRadius: 5,
              backgroundColor: '#ffffff',
              flexDirection: 'row',
              flex: progress,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 10,
                lineHeight: 11,
                backgroundColor: 'transparent',
              }}>
              {`${Math.round(progress * 100)}%`}
            </Text>
          </View>
        </View>
        <Text
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            fontSize: 16,
            textAlign: 'center',
            fontWeight: '500',
            paddingHorizontal: 20,
          }}>
          {'Обновление...'}
        </Text>
      </View>
    </View>
  );
}
