import {useLayoutEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/core';
import {StackNavigationOptions, StackNavigationProp} from '@react-navigation/stack';

export function useDiaryNavOptions(options: Partial<StackNavigationOptions> = {}, deps = []) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();

  useLayoutEffect(() => {
    navigation.setOptions(options);
  }, [navigation, route, ...deps]);
}
