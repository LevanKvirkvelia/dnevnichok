import React from 'react';
import {Pressable, Animated, PressableProps, ViewProps} from 'react-native';

const animated = new Animated.Value(1);
export function PressableOpacity({children, ...props}: Omit<PressableProps, 'children'> & Pick<ViewProps, 'children'>) {
  const fadeIn = () => {
    Animated.timing(animated, {
      toValue: 0.1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  const fadeOut = () => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable onPressIn={fadeIn} onPressOut={fadeOut} {...props}>
      <Animated.View style={{opacity: animated}}>{children}</Animated.View>
    </Pressable>
  );
}
