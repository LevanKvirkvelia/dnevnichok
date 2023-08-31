import React, {PropsWithChildren, useCallback, useRef} from 'react';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {Animated, Text, View} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {useGetLatest} from '../shared/hooks/useGetLatest';

type SwipeableProps = Swipeable extends React.Component<infer P> ? P : never;

interface SwipeToDeleteProps {
  style?: SwipeableProps['containerStyle'];
  disabled?: boolean;
  onDelete?(): void;
}

export function SwipeToDelete({children, disabled, style, onDelete}: PropsWithChildren<SwipeToDeleteProps>) {
  const ref = useRef<Swipeable>(null);
  const handleDelete = useGetLatest(() => (onDelete ? onDelete() : null));

  const renderRightActions = useCallback(
    (progress: Animated.AnimatedInterpolation<number>) => {
      const translateX = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 0],
        extrapolate: 'clamp',
      });

      const onPress = () => {
        handleDelete();
        requestAnimationFrame(() => {
          if (ref.current) ref.current.close();
        });
      };

      return (
        <View style={{width: 80, flexDirection: 'row'}}>
          <Animated.View style={{flex: 1, backgroundColor: '#dd2c00', transform: [{translateX}]}}>
            <RectButton style={{alignItems: 'center', flex: 1, justifyContent: 'center'}} onPress={onPress}>
              <Text style={{color: 'white', fontSize: 16, padding: 5}}>Удалить</Text>
            </RectButton>
          </Animated.View>
        </View>
      );
    },
    [handleDelete],
  );

  return (
    <Swipeable ref={ref} renderRightActions={disabled ? undefined : renderRightActions} childrenContainerStyle={style}>
      {children}
    </Swipeable>
  );
}
