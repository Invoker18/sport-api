import { Prefix } from '../prefix';
import { TimeFormat } from '../../types';

export class TimePrefix extends Prefix {
  timeFormat: TimeFormat;

  constructor(timeFormat: TimeFormat = TimeFormat.European) {
    super('');
    super.setPrefix(this.getTime());

    this.timeFormat = timeFormat;
  }

  private getTime(): string {
    const time = new Date(),
      year = time.getFullYear(),
      month = this.beautify(time.getMonth() + 1),
      day = this.beautify(time.getDay()),
      hours = this.beautify(time.getHours()),
      minutes = this.beautify(time.getMinutes()),
      seconds = this.beautify(time.getSeconds());

    switch (this.timeFormat) {
      case TimeFormat.American:
        return `${month}/${day}/${year} ${hours}/${minutes}/${seconds}`;

      case TimeFormat.European:
      default:
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  }

  private beautify(number: number): string {
    return number < 10 ? `0${number}` : number.toString();
  }
}
