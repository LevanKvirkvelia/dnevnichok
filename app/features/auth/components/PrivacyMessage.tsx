import React from 'react';
import {Text} from 'react-native';
import {useTheme} from '../../themes/useTheme';
import {Link} from '../../../ui/Link';

export const PrivacyMessage = () => {
  const {colors} = useTheme();

  return (
    <Text style={{color: colors.textOnRow}}>
      Нажимая войти, вы соглашаетесь на обработку, хранение и передачу любых
      ваших персональных данных.{' '}
      <Link href="http://mrkoapp.ru/privacy.html">Регламент</Link> и{' '}
      <Link href="http://mrkoapp.ru/politic.pdf">
        политика конфиденциальности
      </Link>
      .
    </Text>
  );
};
