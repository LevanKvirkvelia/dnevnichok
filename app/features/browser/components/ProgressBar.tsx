import React, {useEffect, useState} from 'react';
import {View, Dimensions, Animated} from 'react-native';
import {useTheme} from '../../themes/useTheme';

const {width: windowWidth} = Dimensions.get('window');

interface ProgressBarProps {
  progress: number;
  loading?: boolean;
  color?: string;
  backgroundColor?: string;
}

export function ProgressBar({
  loading,
  progress,
  color = 'rgba(255,255,255,1)',
  backgroundColor,
}: ProgressBarProps) {
  const {colors} = useTheme();
  const [barWidth] = useState(new Animated.Value(0));
  const [alpha] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.timing(barWidth, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();

    return () => barWidth.stopAnimation();
  }, [barWidth, progress]);

  useEffect(() => {
    Animated.timing(alpha, {
      toValue: loading ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    return () => alpha.stopAnimation();
  }, [alpha, loading]);

  return (
    <View
      style={{
        position: 'relative',
        marginTop: 0,
        zIndex: 909000,
        height: 2,
        backgroundColor: backgroundColor || colors.primary,
        flexDirection: 'row',
      }}>
      <Animated.View
        style={{
          width: barWidth.interpolate({
            inputRange: [0, 0.3, 0.6, 1],
            outputRange: [0, windowWidth * 0.5, windowWidth * 0.8, windowWidth],
            extrapolate: 'clamp',
          }),
          backgroundColor: alpha.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(255,255,255,0)', color],
          }),
        }}
      />
    </View>
  );
}
