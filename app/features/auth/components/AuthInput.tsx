import React, {forwardRef, useEffect, useRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  InteractionManager,
  Platform,
  TextInputProps,
  ViewProps,
} from 'react-native';
import Color from 'color';
import {useTheme} from '../../themes/useTheme';

interface AuthInputProps extends Omit<TextInputProps, 'onChange' | 'style'> {
  style?: ViewProps['style'];
  inputStyle?: TextInputProps['style'];
  onSubmit?: TextInputProps['onSubmitEditing'];
  onChange?: TextInputProps['onChangeText'];
  indicator?: React.ReactNode;
  isPassword?: boolean;
  autoFocus?: boolean;
}

export const AuthInput = forwardRef<TextInput, AuthInputProps>(
  (
    {
      style,
      inputStyle,
      value,
      onChange,
      onSubmit,
      placeholder,
      isPassword,
      indicator,
      autoFocus,
      ...props
    },
    ref,
  ) => {
    const {colors} = useTheme();

    const inputRef = useRef<TextInput>();
    const setRef = (el: TextInput) => {
      inputRef.current = el;

      if (typeof ref === 'function') {
        ref(el);
      } else if (ref) {
        ref.current = el;
      }
    };

    useEffect(() => {
      if (!autoFocus) return;

      const {cancel} = InteractionManager.runAfterInteractions(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });

      return cancel;
    }, [autoFocus]);

    return (
      <View style={[styles.container, style, {borderColor: colors.border}]}>
        <TextInput
          ref={setRef}
          style={[styles.input, {color: colors.textOnRow}, inputStyle]}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={Color(colors.textOnRow)
            .alpha(0.3)
            .rgb()
            .toString()}
          returnKeyType="next"
          value={value}
          keyboardType="default"
          underlineColorAndroid="transparent"
          autoCorrect={false}
          autoCapitalize="none"
          onSubmitEditing={onSubmit}
          secureTextEntry={isPassword}
          {...props}
        />
        {indicator}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    fontSize: 16,
    flex: 1,
    paddingVertical: 14,
    ...Platform.select({web: {outlineWidth: 0}}),
  },
});
