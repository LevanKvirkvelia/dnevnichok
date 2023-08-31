import {eduTatarParser} from './engines/EduTatarRu';
import {mosruParser} from './engines/Mosru/Mosru';
import {peterburgParser} from './engines/Peterburg/Peterburg';

export type EngineNames = 'MOS.RU' | 'edu.tatar.ru' | 'Петербургское образование';

export const Parsers: Record<EngineNames, typeof eduTatarParser> = {
  'MOS.RU': mosruParser,
  'edu.tatar.ru': eduTatarParser,
  'Петербургское образование': peterburgParser,
};

export function getParser(name: EngineNames) {
  return Parsers[name]!;
}
