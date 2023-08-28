import {Platform} from 'react-native';
import {
  CardStyleInterpolators,
  StackNavigationOptions,
} from '@react-navigation/stack';
import {useTheme} from '../../themes/useTheme';

export function useAuthScreenOptions(): StackNavigationOptions {
  const {colors} = useTheme();

  return {
    headerTitle: '',
    headerBackTitle: '',
    headerTitleAlign: 'center',
    headerTitleContainerStyle: [
      {
        paddingHorizontal: Platform.OS === 'ios' ? 10 : 0,
      },
      Platform.OS === 'web' && {
        width: '100%',
        paddingHorizontal: 40,
      },
    ],
    headerStyle: {
      height: 60,
      backgroundColor: colors.backgroundSecondary,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
    },
    cardStyleInterpolator:
      Platform.OS === 'android'
        ? CardStyleInterpolators.forVerticalIOS
        : undefined,
    cardOverlayEnabled: true,
    cardStyle: [
      {
        backgroundColor: colors.rowBackgroundColor,
      },
      Platform.OS === 'ios'
        ? {}
        : {borderTopLeftRadius: 12, borderTopRightRadius: 12},
      Platform.OS === 'web'
        ? {borderBottomLeftRadius: 12, borderBottomRightRadius: 12}
        : {},
    ],
  };
}
