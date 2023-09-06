import React from 'react';
import {useDiaryNavOptions} from '../../shared/hooks/useDiaryNavOptions';
import {Palette, useTheme} from '../../features/themes/useTheme';
import {useStoredPhotoPicker} from '../../shared/hooks/useStoredPhotoPicker';
import {TouchableOpacity, View, FlatList, Dimensions, ViewProps, PixelRatio} from 'react-native';
import {usePrevious} from '../../shared/hooks/usePrevious';
import {Button} from '../../ui/Button';
import {useThemeState} from '../../features/themes/useThemeState';
import {BackgroundPreview} from '../../features/themes/BackgroundPreview';
import {IonIcon} from '../../ui/IonIcon';
import {BACKGROUNDS} from '../../features/themes/backgrounds';

const {width, height} = Dimensions.get('window');

export function PaletteCircle({
  name,
  size = 25,
  margin = 0,
  showActive = true,
  style = {},
}: {
  name: keyof typeof Palette;
  size?: number;
  margin?: number;
  showActive?: boolean;
  style?: ViewProps['style'];
}) {
  const {paletteName} = useTheme();

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          margin,
          borderWidth: 1,
          borderColor: '#fff',
          borderRadius: size / 2,
          backgroundColor: Palette[name].primary,
        },
        style,
      ]}>
      {name === paletteName && showActive && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <IonIcon name="checkmark" size={size} style={{color: 'white'}} />
        </View>
      )}
    </View>
  );
}

const themes = Object.keys(Palette) as (keyof typeof Palette)[];
export function ThemeControl({style}: {style?: ViewProps['style']}) {
  const {setPaletteName} = useThemeState();
  const size = 45;
  const margin = size / 5;
  const renderItem = ({item}: {item: keyof typeof Palette}) => (
    <TouchableOpacity onPress={() => setPaletteName(item)}>
      <PaletteCircle name={item} margin={margin} size={size} />
    </TouchableOpacity>
  );
  return (
    <View style={style || [{alignItems: 'center', justifyContent: 'center', padding: margin, marginTop: 0}]}>
      <FlatList data={themes} numColumns={4} keyExtractor={item => item} renderItem={renderItem} />
    </View>
  );
}

const bgList = ['custom', ...Object.values(BACKGROUNDS)];
export function Theme() {
  useDiaryNavOptions({headerTitle: 'Выбор темы'});
  // const {backgroundName} = useTheme();
  const {base64Photo, showPicker} = useStoredPhotoPicker('background', {
    cropping: true,
    compressImageQuality: 0.85,
    // pix ratio from RN api
    width: width * PixelRatio.get(),
    height: height * PixelRatio.get(),
  });

  const {colors} = useTheme();
  const {setBackgroundNameOrUrl} = useThemeState();

  const numColumns = 3;
  const margin = 8;
  const size = (width - margin * 2) / numColumns - margin * 2;

  const renderItem = ({item}: {item: string}) => (
    <TouchableOpacity onPress={() => setBackgroundNameOrUrl(item ? item : null)}>
      <BackgroundPreview bgName={item} margin={margin} size={size} />
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        backgroundColor: colors.rowBackgroundColor,
      }}>
      <FlatList
        ListHeaderComponent={() => {
          return (
            <>
              <ThemeControl />
              <View
                style={{
                  backgroundColor: colors.backgroundColor,
                  height: 16,
                  width,
                  marginHorizontal: -margin,
                }}
              />
              <Button style={{margin}} text="Загрузить свой фон" onPress={showPicker} />
              <View
                style={{
                  backgroundColor: colors.backgroundColor,
                  height: 16,
                  width,
                  marginHorizontal: -margin,
                }}
              />
            </>
          );
        }}
        style={{margin: 0, padding: 0}}
        contentContainerStyle={{margin: 0, paddingHorizontal: margin}}
        data={['', ...(base64Photo ? bgList : bgList.slice(1))]}
        numColumns={numColumns}
        keyExtractor={item => item.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
