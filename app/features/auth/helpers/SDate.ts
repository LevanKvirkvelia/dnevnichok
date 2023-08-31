// TODO remove and use something from NPM

export class SDate {
  static parseDDMMYYY(input: string) {
    let parts = input.split('.');
    return new SDate(parts[2], +parts[1] - 1, parts[0]); // Note: months are 0-based
  }
  static parseYYYYMMDD(input: string) {
    let parts = input.split('-');
    return new SDate(parts[0], +parts[1] - 1, parts[2]); // Note: months are 0-based
  }

  date = new Date();
  monthA = 'января,февраля,марта,апреля,мая,июня,июля,августа,сентября,октября,ноября,декабря'.split(',');

  constructor(...date: any) {
    if (date)
      if (date[0] && date[0].date) this.date = date[0].date;
      else {
        // @ts-ignore
        this.date = new Date(...date);
      }
    if (!this.date) this.date = new Date();
  }

  yyyymmdd() {
    let yyyy = this.date.getFullYear().toString();
    let mm = (this.date.getMonth() + 1).toString(); // getMonth() is zero-based
    let dd = this.date.getDate().toString();

    return yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]);
  }

  weekName() {
    return ['', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'][this.getWeekDayNum()];
  }

  weekNameAccus() {
    return ['', 'понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу'][this.getWeekDayNum()];
  }

  ddmmyyyy() {
    let yyyy = this.date.getFullYear().toString();
    let mm = (this.date.getMonth() + 1).toString(); // getMonth() is zero-based
    let dd = this.date.getDate().toString();

    return (dd[1] ? dd : '0' + dd[0]) + '.' + (mm[1] ? mm : '0' + mm[0]) + '.' + yyyy;
  }

  getWeekDayNum() {
    let dayNum = this.date.getDay();
    if (dayNum == 0) return 7;
    else return dayNum;
  }

  addHours(h: number) {
    this.date.setTime(this.date.getTime() + h * 60 * 60 * 1000);
    return this;
  }

  setDayPlus(num: number) {
    this.date.setDate(this.date.getDate() + num);
    return this;
  }

  rus() {
    return this.date.getDate() + ' ' + this.monthA[this.date.getMonth()];
  }

  getTime() {
    return this.date.getTime();
  }

  setMonday() {
    this.date.setDate(this.date.getDate() - this.getWeekDayNum() + 1);
    return this;
  }

  setLastDay() {
    this.date.setDate(this.date.getDate() + 7 - this.getWeekDayNum());
    return this;
  }

  copy() {
    return new SDate(this.date.getTime());
  }

  getClassDate() {
    return new Date(this.date.getTime());
  }

  getLastWorkDate(is6: boolean): SDate {
    let maxD = is6 ? 7 : 6;
    return this.setDayPlus(-1).getWeekDayNum() >= maxD ? this.getLastWorkDate(is6) : this;
  }

  getNextWorkDate(is6: boolean): SDate {
    let maxD = is6 ? 7 : 6;
    return this.setDayPlus(1).getWeekDayNum() < maxD ? this : this.getNextWorkDate(is6);
  }

  isFuture() {
    return this.date.getTime() > new Date().getTime();
  }

  year() {
    return this.date.getFullYear();
  }
}
