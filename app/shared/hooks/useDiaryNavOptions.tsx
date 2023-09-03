import {useEffect, useLayoutEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/core';
import {StackNavigationOptions, StackNavigationProp} from '@react-navigation/stack';
import {useTheme} from '../../features/themes/useTheme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export function useDiaryNavOptions(options: Partial<StackNavigationOptions> = {}, deps = []) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const {colors} = useTheme();
  const {top} = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({
      headerTruncatedBackTitle: 'Назад',
      headerBackTitle: 'Назад',
      headerTintColor: colors.textOnPrimary,
      headerStatusBarHeight: top,
      headerStyle: {
        backgroundColor: colors.primary,
        borderBottomWidth: 0,
        elevation: 0,
        shadowOffset: {height: 0, width: 0},
      },
      headerTitleContainerStyle: {
        paddingHorizontal: 10,
      },
      ...options,
    });
  }, [navigation, route, colors.primary, colors.textOnPrimary, ...deps]);
}
