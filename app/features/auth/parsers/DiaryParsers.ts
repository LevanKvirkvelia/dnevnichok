import { EduTatarRu } from "./parsers/EduTatarRu";
import { Mosru } from "./parsers/Mosru/Mosru";
import { Peterburg } from "./parsers/Peterburg/Peterburg";

export type Engines = Mosru | EduTatarRu | Peterburg;

export type EngineNames =
  | 'MOS.RU'
  | 'edu.tatar.ru'
  | 'Петербургское образование';

export class DiaryParsers {
  static clearCookies = () => {};

  static addClearCookies(func: () => {}, reset = false) {
    const oldClear = DiaryParsers.clearCookies;
    DiaryParsers.clearCookies = () => {
      if (!reset) oldClear();
      func();
    };
  }

  static cache: Partial<Record<EngineNames, Engines>> = {};

  static get(engineName: EngineNames) {
    if (!DiaryParsers.cache[engineName]) {
      DiaryParsers.cache[engineName] = DiaryParsers.getInstance(engineName);
    }
    return DiaryParsers.cache[engineName]!;
  }

  static getInstance(engineName: EngineNames): Engines {
    if (engineName == 'MOS.RU') return new Mosru();
    if (engineName == 'edu.tatar.ru') return new EduTatarRu();
    if (engineName == 'Петербургское образование') return new Peterburg();
    throw new Error('bad engineName');
  }
}
