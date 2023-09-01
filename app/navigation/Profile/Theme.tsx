import React from 'react';
import {useDiaryNavOptions} from '../../shared/hooks/useDiaryNavOptions';

export function Theme() {
  useDiaryNavOptions({headerTitle: 'Выбор темы'});
  return <BackgroundControl />;
}
