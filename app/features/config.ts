import {Platform} from 'react-native';
import logo from '../assets/ru.inkout.mcko.png';

const IS_LOCAL = false;

export const Config = {
  defaultTheme: 'green',
  server: IS_LOCAL ? 'http://192.168.1.74' : 'https://api.diaryapp.ru',
  qAPI: false ? 'http://localhost:3000' : 'https://questions.diaryapp.ru',
  bundleId: 'ru.inkout.mcko',
  worker: 'MOS.RU',
  canSelectWorker: true,
  logo,
  logoOutline: require(`../assets/logo.png`),
  storeLink:
    Platform.OS === 'ios'
      ? 'https://itunes.apple.com/ru/app/mrko-elektronnyj-dnevnik-dla/id1048768805'
      : 'https://play.google.com/store/apps/details?id=ru.inkout.mcko',
};
