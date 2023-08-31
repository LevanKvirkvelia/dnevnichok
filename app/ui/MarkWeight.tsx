import React from 'react';
import {Text} from 'react-native';

const weights: {[k: number]: string} = {
  2: '²',
  3: '³',
  4: '⁴',
  5: '⁵',
};

export function MarkWeight({weight}: {weight?: null | number | string}) {
  const symbol = weight && weights[Number(weight)];

  if (!symbol) return null;
  return <Text style={{color: 'inherit'}}>{symbol}</Text>;
}
