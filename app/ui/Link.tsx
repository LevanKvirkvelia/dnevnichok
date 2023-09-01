import React from 'react';
import {Pressable, Text, TextProps, Touchable} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {useTheme} from '../features/themes/useTheme';
import {openLink} from '../shared/hooks/useOptimisticOpenLink';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {PressableOpacity} from './PressableOpacity';

interface LinkProps extends TextProps {
  disabled?: boolean;
  to?: string;
  href?: string;
  onPress?(): void;
}

export const Link: React.FC<LinkProps> = ({style, children, to, href, onPress, disabled, ...props}) => {
  const {colors} = useTheme();
  const navigation = useNavigation<any>(); // TODO FIX

  const handlePress = () => {
    if (disabled) return;
    if (onPress) onPress();
    if (to) navigation.navigate(to, {href});
    else if (href) openLink(href);
  };

  return (
    <PressableOpacity onPress={handlePress} pressRetentionOffset={15} hitSlop={10}>
      <Text
        accessibilityRole="button"
        style={[{color: colors.linkColor, opacity: disabled ? 0.6 : 1}, style]}
        {...props}>
        {children}
      </Text>
    </PressableOpacity>
  );
};
