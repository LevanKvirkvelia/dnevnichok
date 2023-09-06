import Color from 'color';
import {Dimensions, PixelRatio, Platform, StyleSheet} from 'react-native';
import {useThemeState} from './useThemeState';

export const Palette = {
  green: {
    primary: '#1b9b9c',
    button: '#1b9b9c',
    activeTab: '#1a8485',
    primaryDark: '#1a7374',
  },
  blue: {
    primary: '#1976d2',
    button: '#1976d2',
    activeTab: '#1976d2',
    primaryDark: '#004ba0',
  },
  indigo: {
    primary: '#303f9f',
    button: '#303f9f',
    activeTab: '#303f9f',
    primaryDark: '#001970',
  },
  red: {
    primary: '#d32f2f',
    button: '#d32f2f',
    activeTab: '#d32f2f',
    primaryDark: '#9a0007',
  },
  pink: {
    primary: '#d81b60',
    button: '#d81b60',
    activeTab: '#d81b60',
    primaryDark: '#a00037',
  },
  orange: {
    primary: '#f57c00',
    button: '#f57c00',
    activeTab: '#f57c00',
    primaryDark: '#bb4d00',
    textOnPrimary: '#000',
    barStyle: 'dark-content',
  },
  darkBlue: {
    primary: Color('#19232c').lighten(0.1).rgb().toString(),
    button: Color('#19232c').lighten(0.6).rgb().toString(),
    fileRow: Color('#19232c').lighten(0.6).rgb().toString(),
    fileRowTextColor: 'rgba(255,255,255,0.8)',
    tabsBackground: Color('#19232c').lighten(0.1).rgb().toString(),
    activeTab: '#386b9a',
    primaryDark: '#19232c',
    textOnPrimary: '#fff',
    backgroundColor: '#19232c',
    inactiveTab: Color('#fff').alpha(0.2).rgb().toString(),
    cardColor: Color('#21303f').alpha(0.76).rgb().toString(),
    authButtonBackground: Color('#fff').alpha(0.08).rgb().toString(),
    rowBackgroundColor: Color('#19232c').lighten(0.3).rgb().toString(),
    textOnRow: '#fff',
    marks: Color('#64ffda').alpha(0.8).rgb().toString(),
    good: Color('#12c3bd').alpha(0.8).rgb().toString(),
    problem: Color('#ec6045').alpha(0.8).rgb().toString(),
    normal: Color('#ffcc00').alpha(0.8).rgb().toString(),
    nothing: Color('#d8d8db').alpha(0.8).rgb().toString(),
    border: 'rgba(0, 0, 0, 0.15)',
    backgroundSecondary: Color('#21303f').lighten(0.2).rgb().toString(),
    questionsSecondary: Color('#19232c').lighten(0.6).rgb().toString(),
  },
  dark: {
    primary: '#1C1C1E',
    tabsBackground: '#1C1C1E',
    fileRow: '#323234',
    fileRowTextColor: 'rgba(255,255,255,0.8)',
    activeTab: '#5E92F0',
    button: '#323234',
    primaryDark: '#19232c',
    textOnPrimary: '#fff',
    backgroundColor: '#000',
    authBackgroundColor: '#000',
    border: '#27262B',
    searchBar: Color('#fff').alpha(0.1).rgb().toString(),
    serviceShareColor: Color('#fff').alpha(0.1).rgb().toString(),
    cardColor: Color('#1C1C1E').alpha(0.76).rgb().toString(),
    rowBackgroundColor: '#1C1C1E',
    textOnRow: '#fff',
    inactiveTab: Color('#fff').alpha(0.2).rgb().toString(),
    marks: Color('#64ffda').alpha(0.8).rgb().toString(),
    good: Color('#12c3bd').alpha(0.8).rgb().toString(),
    problem: Color('#ec6045').alpha(0.8).rgb().toString(),
    normal: Color('#ffcc00').alpha(0.8).rgb().toString(),
    nothing: Color('#d8d8db').alpha(0.8).rgb().toString(),
    backgroundSecondary: '#1C1C1E',
    questionsSecondary: '#323234',
  },
} as const;

const defaultColors = {
  primary: '#1b9b9c',
  button: '#1b9b9c',
  activeTab: '#1a8485',
  primaryDark: '#1a7374',
  inactiveTab: Color('#000').alpha(0.3).rgb().toString(),
  cardColor: Color('rgba(167,167,167)').alpha(0.7).rgb().toString(),
  authButtonBackground: Color('rgba(167,167,167)').alpha(0.3).rgb().toString(),
  textOnAuthCard: Color('#fff').alpha(0.91).rgb().toString(),
  linkColor: '#0066FF',
  searchBar: 'rgba(0, 0, 0, 0.2)',
  textOnPrimary: '#fff',
  tabsBackground: '#fff',
  backgroundColor: '#efeff5',
  rowBackgroundColor: '#fff',
  fileRowTextColor: 'rgba(255,255,255,0.8)',
  marks: '#1b9b9c',
  textOnRow: 'rgba(0, 0, 0, 0.9)',
  border: '#EFF1F8',
  good: '#32C174',
  problem: '#F64C35',
  normal: '#F69235',
  nothing: '#d8d8db',
  barStyle: 'light-content',
  description: '#808080',
  backgroundSecondary: 'rgb(249, 249, 249)',
  fileRow: '#E3E9EE',
  questionsPrimary: '#6559E5' as '#22A3A3' | '#6559E5',
  questionsSecondary: '#F6F3F7',
};
export function useTheme() {
  const {paletteName, backgroundNameOrUrl} = useThemeState();

  const colors = {...defaultColors, ...Palette[paletteName as keyof typeof Palette]};

  return {
    isDark: paletteName.includes('dark'),
    backgroundNameOrUrl,
    paletteName,
    colors,
    styles: StyleSheet.create({
      mainWrapper: {
        backgroundColor: colors.rowBackgroundColor,
        borderRadius: 5,
        overflow: 'hidden',
        marginHorizontal: 5,
        marginTop: 5, // TODO refactor
      },
      largeWrapper: {},
      mainContainer: {
        alignSelf: 'stretch',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        flexDirection: 'row',
      },
      primaryBackground: {
        backgroundColor: colors.backgroundColor,
      },
      tabsBackground: {
        backgroundColor: colors.tabsBackground,
      },
      flex1: {
        flex: 1,
      },
      flex1Clmn: {
        flex: 1,
      },
      container: {
        flex: 1,
      },
      inputContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderRadius: 9,
        overflow: 'hidden',
        padding: 0,
        backgroundColor: colors.rowBackgroundColor,
        borderWidth: 0,
        borderColor: 'rgba(27,155,156,1)',
      },
      lessonType: {
        alignSelf: 'flex-start',
        marginVertical: 2,
        borderRadius: 6,
        color: 'white',
        backgroundColor: '#ea2b33',
        paddingVertical: 2,
        paddingHorizontal: 5,
      },
      backgroundImage: {
        flex: 1,
        width: undefined,
        height: undefined,
      },
      link: {
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        textDecorationColor: '#fff',
      },
      wizView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        flex: 1,
        borderBottomWidth: 0,
        borderColor: colors.border,
      },
      fakeText: {
        flexGrow: 0,
        fontSize: 20,
        color: 'white',
      },
      input: {
        flex: 1,
        fontSize: 20,
        color: colors.textOnRow,
        margin: 0,
        padding: 0,
      },
      whiteText: {
        color: 'white',
        marginTop: 20,
      },
      container2: {
        padding: 40,
        width: Dimensions.get('window').width,
        paddingTop: Dimensions.get('window').height * 0.19,
      },
      roundedInput: {
        borderRadius: 6,
        borderWidth: 1,
      },
      input16: {
        fontSize: 16,
        color: colors.textOnRow,
      },
      main: {},
      title: {
        fontWeight: '400',
        fontSize: 18,
        color: colors.textOnRow,
      },
      time: {
        color: colors.description,
        fontWeight: '300',
      },
      numberField: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        // borderRightWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
        paddingVertical: 6,
        paddingLeft: 6,
        borderColor: Color(colors.textOnRow).alpha(0.15).rgb().toString(),
        width: 19,
      },
      cacheText: {
        fontSize: 12,
        alignSelf: 'center',
        color: colors.description,
      },
      // ---- СКОРЕЕ ВСЕГО СНИЗУ ПРАВИЛЬНЫЕ СТИЛИ
      list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      flexRow: {
        flexDirection: 'row',
      },

      diaryMarkField: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        marginLeft: 3,
      },
      periodsMarkField: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: 25,
      },
      item: {
        fontWeight: Platform.OS === 'android' ? '700' : '600',
        color: colors.marks,
        fontSize: 15,
      },
      small: {
        fontWeight: '700',
        color: colors.marks,
        fontSize: 11,
      },
      title400: {
        fontWeight: '400',
      },
      text: {
        fontWeight: '300',
      },
      textOnRow: {
        fontWeight: '300',
        color: colors.textOnRow,
      },
      middleField: {
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#d0d0d0',
        width: 50,
      },
      arrowField: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        alignSelf: 'stretch',
        width: 20,
      },
      contentField: {
        flex: 1,
        padding: 6,
      },
      lessonNum: {
        color: Color(colors.textOnRow).alpha(0.5).rgb().toString(),
        alignItems: 'center',
        textAlign: 'center',
        width: 20,
        fontWeight: '400',
        fontSize: 18,
      },
      resultText: {
        color: colors.textOnRow,
        fontSize: 15,
      },
      settingsView: {
        backgroundColor: colors.rowBackgroundColor,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.border,
        padding: 15,
        marginTop: 15,
      },
      // --- все
      itemBox: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
      },
      titleBox: {
        flex: 1,
        marginLeft: 15,
        flexDirection: 'row',
      },
      titleText: {
        flex: 1,
        alignSelf: 'center',
      },
      titleView: {
        flex: 1,
        alignSelf: 'flex-start',
      },
      rightSide: {
        marginRight: 15,
        alignSelf: 'center',
      },
      editableText: {
        flex: 1,
        textAlign: 'right',
        marginRight: 15,
      },
      titleAlpha: {
        fontWeight: '500',
        fontSize: 18,
        color: colors.textOnRow,
      },
      subtitle: {
        fontWeight: '300',
        color: colors.textOnRow,
      },
      arrowFieldNoteButton: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 15,
        alignSelf: 'stretch',
        width: 40,
      },
      listNoteButton: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
      horizontalDivider: {
        height: 1,
        borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
        borderColor: Color(colors.textOnRow).alpha(0.15).rgb().toString(),
      },
    }),
  };
}
