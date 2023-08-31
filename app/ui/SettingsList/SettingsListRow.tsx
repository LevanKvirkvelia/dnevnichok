import React from 'react';
import {View, TouchableOpacity, ViewProps} from 'react-native';

import {Divider} from './Divider';
import {useTheme} from '../../features/themes/useTheme';

export interface SettingsListRowProps {
  style?: ViewProps['style'];
  last?: boolean;
  dividers?: React.ReactNode | boolean;
  onPress?(): void;
}

export function SettingsListRow({
  style = {},
  dividers = true,
  last,
  children,
  onPress,
}: React.PropsWithChildren<SettingsListRowProps>) {
  const {colors} = useTheme();
  const ViewComponent = (onPress ? TouchableOpacity : View) as typeof TouchableOpacity;

  const divider = dividers && typeof dividers === 'boolean' ? <Divider style={{marginLeft: 15}} /> : dividers;

  return (
    <View>
      <ViewComponent
        className="flex-shrink pl-4 py-4 justify-between"
        style={[{borderColor: colors.border}, style]}
        onPress={onPress}>
        {children}
      </ViewComponent>
      {last ? null : divider}
    </View>
  );
}
