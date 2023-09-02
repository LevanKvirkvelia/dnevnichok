import {Platform} from 'react-native';
import logo from '../assets/ru.inkout.mcko.png';


export const Config = {
  defaultTheme: 'green',
  bundleId: 'ru.inkout.mcko',
  worker: 'MOS.RU',
  logo,
  logoOutline: require(`../assets/logo.png`),
  storeLink:
    Platform.OS === 'ios'
      ? 'https://itunes.apple.com/ru/app/mrko-elektronnyj-dnevnik-dla/id1048768805'
      : 'https://play.google.com/store/apps/details?id=ru.inkout.mcko',
};
