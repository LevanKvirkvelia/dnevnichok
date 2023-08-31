import Clipboard from '@react-native-community/clipboard';
import {SDate} from '../../features/auth/helpers/SDate';
import {ILesson} from '../../features/parsers/data/types';
import {showMessage} from '../../ui/FlashMessage';

export function copyHomework({name, homework, date}: ILesson) {
  if (!name || !homework?.text) return;
  const stringDate = SDate.parseDDMMYYY(date).rus();
  let hw = `${name} на ${stringDate}\n${homework.text}`;

  // TODO add short link to app
  // const link = await Lib.generateShortLink(`https://dnevnichok.ru/homework`);
  // hw += `\nДомашнее задание по другим предметам: ${link}`;

  Clipboard.setString(hw);

  showMessage({
    message: 'Домашнее задание скопировано',
    type: 'default',
  });
}
