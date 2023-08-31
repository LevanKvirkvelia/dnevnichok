import {useEffect, useLayoutEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/core';
import {StackNavigationOptions, StackNavigationProp} from '@react-navigation/stack';
import {useTheme} from '../../features/themes/useTheme';
import {PeriodsHeader} from '../../features/marks/components/PeriodsHeader';

export function useDiaryNavOptions(options: Partial<StackNavigationOptions> = {}, deps = []) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();

  useEffect(() => {
    console.log('route updated');
    navigation.setOptions(options);
  }, [navigation, route, ...deps]);
}
