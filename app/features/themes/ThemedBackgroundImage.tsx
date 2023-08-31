import React from 'react';
import {StyleProp, useWindowDimensions, View, ViewStyle} from 'react-native';
import {useTheme} from './useTheme';
import FastImage from 'react-native-fast-image';

export const ThemedBackgroundImage = React.memo(function (
  props: {style: StyleProp<ViewStyle>} & React.PropsWithChildren<any>,
) {
  const {colors, background, backgroundName} = useTheme();
  const {style, ...restProps} = props;

  const {width} = useWindowDimensions();

  const {photo} = useAsyncStoragePhoto('background', [backgroundName]);

  return backgroundName ? (
    <View style={{flex: 1, flexDirection: 'column', ...style, backgroundColor: colors.backgroundColor}}>
      <FastImage
        {...props}
        source={{uri: backgroundName?.includes('AsyncStorage') ? photo : cdnImage(background || '', {q: 90})}}
        style={{width, flex: 1, ...style}}
      />
    </View>
  ) : (
    <View {...props} style={{flex: 1, flexDirection: 'column', ...style, backgroundColor: colors.backgroundColor}} />
  );
});
