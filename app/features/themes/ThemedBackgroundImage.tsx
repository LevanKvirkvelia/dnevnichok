import React from 'react';
import {StyleProp, useWindowDimensions, View, ViewStyle} from 'react-native';
import {useTheme} from './useTheme';
import FastImage from 'react-native-fast-image';
import {useStoredPhotoPicker} from '../../shared/hooks/useStoredPhotoPicker';

export const ThemedBackgroundImage = React.memo(function (
  props: {style: StyleProp<ViewStyle>} & React.PropsWithChildren<any>,
) {
  const {colors, backgroundNameOrUrl} = useTheme();
  const {style, ...restProps} = props;

  const {width} = useWindowDimensions();
  const {base64Photo} = useStoredPhotoPicker('background');

  // const {photo} = useAsyncStoragePhoto('background', [backgroundName]);

  return backgroundNameOrUrl ? (
    <View style={{flex: 1, flexDirection: 'column', ...style, backgroundColor: colors.backgroundColor}}>
      <FastImage
        {...props}
        source={{uri: backgroundNameOrUrl == 'custom' ? base64Photo : backgroundNameOrUrl}}
        style={{width, flex: 1, ...style}}
      />
    </View>
  ) : (
    <View {...props} style={{flex: 1, flexDirection: 'column', ...style, backgroundColor: colors.backgroundColor}} />
  );
});
