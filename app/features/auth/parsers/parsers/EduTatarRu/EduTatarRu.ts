import {hash, IMinimumDiaryParser, IAuthData, Request} from '../..';
import {Day, Lesson, Marks, Mark, SDate} from '../..';

const validator = require('email-validator');
const cheerio = require('cheerio-without-node-native');
const md5 = require('md5');

export class EduTatarRu implements IMinimumDiaryParser {
  activeLogin = '';
  __login: any = false;
  _onAuthed: any = false;
  r: Request;
  authData = {
    login: '',
    password: '',
    engine: 'edu.tatar.ru',
  };

  onAuthed: Promise<void>;
  resolveAuthed: (...rest) => void;

  async clearCookies() {
    // await CookieManager.clearAll()
    this.onAuthed = new Promise(ok => (this.resolveAuthed = ok));
    this.__login = false;
    if (this.r) await this.r.clearCookies();
  }

  sleep(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async _login(login: string, password: string) {
    this.activeLogin = login;
    let logon = await this.r.post(
      'https://edu.tatar.ru/logon',
      {
        main_login: login,
        main_password: password,
      },
      {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        Referer: 'https://edu.tatar.ru/logon',
        Origin: 'https://edu.tatar.ru',
      },
      'form',
      'all',
    );
    if (logon.data.indexOf('Моя анкета') + 1) {
      this.resolveAuthed();
      return true;
    } else throw new Error('Неправильный логин или пароль');
  }

  async login(authData: IAuthData) {
    let login = authData.login;
    let password = authData.password;
    let method = authData.method;

    this.authData.login = login;
    this.authData.password = password;
    this.r = new Request('edu.tatar.ru:' + [login, password].join(':'));
    if (this.__login) return this.__login;
    await this.clearCookies();
    // if (method == 'gosuslugi') return await this._loginESIA(login, password);
    this.__login = this._login(login, password);
    this.__login
      .then(() => (this.__login = null))
      .catch(() => (this.__login = null));
    return this.__login;
  }

  async getDaysWithDay(user: any, sDate: SDate) {
    await this.onAuthed;
    let date = new SDate(sDate);
    let data = await this.r.get(
      'https://edu.tatar.ru/user/diary/day',
      {
        for: Math.floor(date.date.getTime() / 1000),
      },
      {
        Referer: 'https://edu.tatar.ru/logon',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      'text',
    );
    let day = new Day(date.ddmmyyyy());
    const $ = cheerio.load(data.trim());

    $('tbody>tr').map((index: number, element: any) => {
      let lesson = $(element);
      lesson = lesson.children('td');

      let marks: Mark[] = [];
      $(lesson[4])
        .children()
        .first()
        .children()
        .first()
        .children()
        .map((index: number, element: any) => {
          let mark = $(element);
          marks.push(
            new Mark({
              date: date.ddmmyyyy(),
              value: mark.children().first().text(),
              weight: 1,
              name: mark.attr('title'),
            }),
          );
        });
      lesson = lesson.map((i: number, e: any) => {
        return $(e).text().trim();
      });
      day.addLesson(
        new Lesson({
          id: hash(lesson[1]),
          number: index + 1,
          name: lesson[1],
          date: date.ddmmyyyy(),
          homework: {
            text: lesson[2],
            attachments: [],
          },
          marks,
          comment: lesson[3],
          teacherId: md5(`${user.classId} ${lesson[1]}`),
        }),
      );
    });
    return [day];
  }

  async getLenPeriods() {
    await this.onAuthed;
    let terms = await this.r.post(
      'https://edu.tatar.ru/user/diary/term?term=1',
      {},
      {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      'form',
      'text',
    );
    const $ = cheerio.load(terms.trim());
    return $('#term').children().length - 1;
  }

  async getStudents() {
    let data = await this.r.get(
      'https://edu.tatar.ru/user/anketa/index',
      {},
      {},
      'text',
    );
    let diary = await this.r.get(
      'https://edu.tatar.ru/user/diary/week',
      {},
      {},
      'text',
    );
    const $anketa = cheerio.load(data.trim());
    let name = $anketa($anketa('.tableEx tr td')[1]).text();
    let profileId = $anketa($anketa('.tableEx tr td')[3]).text();
    let schoolName = $anketa($anketa('.tableEx tr td')[5]).text();

    const $diary = cheerio.load(diary.trim());
    let className = $diary('.top-panel-user span')
      .text()
      .split(',')[1]
      .split(' ')[0]
      .trim();

    return [
      {
        profileId,
        name: name,
        schoolId: hash(schoolName),
        classId: hash(className),
        schoolName,
        className,
        marksAccess: true,
      },
    ];
  }

  async getAllPeriods(userData: any) {
    let periodsLen = await this.getLenPeriods();
    return await Promise.all(
      Array(periodsLen)
        .fill(null)
        .map(
          async (u, i: number) => (await this.getPeriodsWith(userData, i))[0],
        ),
    );
  }

  async getPeriodsWith(user: any, period: number) {
    await this.onAuthed;
    let terms = await this.r.post(
      'https://edu.tatar.ru/user/diary/term',
      {term: period},
      {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      'form',
      'text',
    );
    const $ = cheerio.load(terms.trim());
    let marks = new Marks();
    marks.number = period;
    $('tbody tr').each((i: number, tableRowEl: any) => {
      const tableRow = $(tableRowEl);
      const cells = tableRow.children();

      const lessonName = $(cells[0]).text();
      const lessonID = hash(lessonName);

      if (lessonName === 'ИТОГО') return;

      marks.addLesson(lessonName, lessonID);

      const length = cells.length;
      cells.each((index: number, cellEl: any) => {
        const value = $(cellEl).text();

        if (index > 0 && index < length - 3 && value) {
          marks.addMark(lessonID, new Mark({value, weight: 1, name: ''}));
        }
      });
    });
    return [marks];
  }

  async getAccountId() {
    return this.authData.engine + ':' + this.authData.login.toLowerCase();
  }

  getClassmates = () => undefined;
}
