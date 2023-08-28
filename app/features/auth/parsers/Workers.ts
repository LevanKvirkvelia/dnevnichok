import {Source} from 'react-native-fast-image';
import mosLogo from './assets/mos_ru.png';
import eduTatarLogo from './assets/edu_tatar.png';
import spbLogo from './assets/petersburg.png';
import {EngineNames} from '.';

type Worker = {
  name: EngineNames;
  subTitle: string;
  logo: Source;
  placeholderLogin: string;
  placeholderPassword: string;
  lat: number;
  lon: number;
  SMSAuth?: boolean;
  buttonColor: string;
  recoveryLink?: string;
};

export const WORKERS: Record<EngineNames, Worker> = {
  'MOS.RU': {
    name: 'MOS.RU',
    subTitle: 'Для Москвы',
    logo: mosLogo,
    placeholderLogin: 'Логин (телефон, почта или СНИЛС)',
    placeholderPassword: 'Пароль от mos.ru',
    lat: 55.75222,
    lon: 37.61556,
    SMSAuth: true,
    buttonColor: '#4189D8',
    recoveryLink:
      'https://oauth20.mos.ru/selfservice/registration/openrecoverpassword.do',
  },
  'edu.tatar.ru': {
    name: 'edu.tatar.ru',
    subTitle: 'Для Татарстана',
    logo: eduTatarLogo,
    placeholderLogin: 'Введите логин',
    placeholderPassword: 'Пароль',
    lat: 55.78874,
    lon: 49.12214,
    buttonColor: '#429891',
  },
  'Петербургское образование': {
    name: 'Петербургское образование',
    subTitle: 'Для Санкт-Петербурга',
    logo: spbLogo,
    placeholderLogin: 'Введите логин',
    placeholderPassword: 'Пароль',
    lat: 59.93863,
    lon: 30.31413,
    buttonColor: '#C93127',
    recoveryLink: 'https://petersburgedu.ru/user/auth/remind/',
  },
};
