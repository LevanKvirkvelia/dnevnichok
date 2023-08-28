import React from 'react';
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
  ScrollView,
  ScrollViewProps,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface ScrollContainerProps extends KeyboardAvoidingViewProps {
  scrollProps?: ScrollViewProps;
}

export const AvoidingScrollContainer: React.FC<ScrollContainerProps> = ({
  children,
  style,
  scrollProps: {contentContainerStyle, ...scrollProps} = {},
  ...props
}) => {
  const {bottom} = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled={Platform.OS === 'ios'}
      keyboardVerticalOffset={bottom + 108}
      style={[{flex: 1}, style]}
      {...props}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[{paddingBottom: 65}, contentContainerStyle]}
        {...scrollProps}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
