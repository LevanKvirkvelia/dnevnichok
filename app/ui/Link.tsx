import React from 'react';
import {Text, TextProps} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {useTheme} from '../features/themes/useTheme';
import {openLink} from '../shared/hooks/useOptimisticOpenLink';

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
    <Text
      accessibilityRole="button"
      onPress={handlePress}
      style={[{color: colors.linkColor, opacity: disabled ? 0.6 : 1}, style]}
      {...props}>
      {children}
    </Text>
  );
};
