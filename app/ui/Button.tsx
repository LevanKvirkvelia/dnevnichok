import React from 'react';
import {IconProps} from 'react-native-vector-icons/Icon';
import {SquircleView} from 'react-native-figma-squircle';
import {ActivityIndicator, Text, TouchableOpacityProps, TextProps, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme} from '../features/themes/useTheme';
import {IonIcon} from './IonIcon';

export interface ButtonProps extends TouchableOpacityProps {
  text?: React.ReactNode;
  textStyle?: TextProps['style'];
  icon?: IconProps['name'] | React.ReactNode;
  loading?: boolean;
  fluid?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  style: styleProp,
  text,
  textStyle,
  children,
  icon,
  loading = false,
  fluid = false,
  disabled,
  ...props
}) => {
  const {colors} = useTheme();
  const {
    backgroundColor = colors.button,
    borderRadius = 6,
    marginLeft,
    margin,
    marginRight,
    marginBottom,
    marginTop,
    ...style
  } = StyleSheet.flatten(styleProp) || {};

  return (
    // @ts-ignore // todo fix props types
    <TouchableOpacity disabled={disabled} {...props}>
      <SquircleView
        style={{
          margin,
          marginLeft,
          marginRight,
          marginBottom,
          marginTop,
        }}
        squircleParams={{
          cornerSmoothing: 0.7,
          cornerRadius: Number(borderRadius),
          fillColor: backgroundColor as string,
        }}>
        <View
          style={[
            {
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 12,
            },
            fluid && {width: '100%'},
            disabled && {opacity: 0.4},
            style,
          ]}>
          {loading ? (
            <ActivityIndicator style={{width: 30}} color={colors.textOnPrimary} />
          ) : (
            <>
              {typeof icon === 'string' ? (
                <IonIcon
                  name={icon}
                  size={20}
                  style={{
                    flexShrink: 1,
                    color: colors.textOnAuthCard,
                    alignSelf: 'center',
                    textAlign: 'right',
                    fontWeight: 'bold',
                  }}
                />
              ) : (
                icon || null
              )}
              <Text
                style={[
                  {
                    margin: 0,
                    flex: undefined,
                    textAlign: 'center',
                    marginLeft: icon ? 10 : 0,
                    color: colors.textOnAuthCard,
                    fontSize: 16,
                  },
                  textStyle,
                ]}>
                {children || text}
              </Text>
            </>
          )}
        </View>
      </SquircleView>
    </TouchableOpacity>
  );
};
