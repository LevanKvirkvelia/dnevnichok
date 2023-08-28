import Color from 'color';

export function useTheme() {
  return {
    colors: {
      primary: '#1b9b9c',
      button: '#1b9b9c',
      activeTab: '#1a8485',
      primaryDark: '#1a7374',
      inactiveTab: Color('#000').alpha(0.3).rgb().toString(),
      cardColor: Color('rgba(167,167,167)').alpha(0.7).rgb().toString(),
      authButtonBackground: Color('rgba(167,167,167)')
        .alpha(0.3)
        .rgb()
        .toString(),
      textOnAuthCard: Color('#fff').alpha(0.91).rgb().toString(),
      linkColor: '#0066FF',
      searchBar: 'rgba(0, 0, 0, 0.2)',
      textOnPrimary: '#fff',
      tabsBackground: '#fff',
      backgroundColor: '#efeff5',
      rowBackgroundColor: '#fff',
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
    },
  };
}
