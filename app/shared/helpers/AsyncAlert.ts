import {Alert, AlertButton} from 'react-native';

export function AsyncAlert({
  title,
  message,
  buttons,
}: {
  title: string;
  message?: string | undefined;
  buttons: AlertButton[];
}) {
  return new Promise((resolve, reject) => {
    const buttonsWithFunc = buttons.map(button => {
      return {...button, onPress: () => resolve(button.text)};
    });
    Alert.alert(title, message, buttonsWithFunc, {cancelable: false});
  });
}
