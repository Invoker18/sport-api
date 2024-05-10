import {
  ITransport,
  LogLevel,
  LogLevelDisplay,
  LogLevelIcon,
  Style,
  Format,
} from '../../types';
import { Transport } from '../transport';

/*
 *
 * Console transport
 *
 * This will log all desired messages to your console
 *
 * */
export class ConsoleTransport extends Transport implements ITransport {
  log(level: LogLevel, message: string): void {
    for (const lvl in this.level)
      if (
        this.level.hasOwnProperty(lvl) &&
        this.level[lvl] === level &&
        typeof this.options !== 'undefined'
      )
        switch (this.options.format) {
          case Format.json:
            console.log(
              this.options.logColors[level] +
                JSON.stringify({
                  prefix:
                    this.options.prefix.getPrefix() === ''
                      ? ''
                      : '[' + this.options.prefix.getPrefix() + ']',

                  logLevelDisplay:
                    this.options.logLevelDisplay === LogLevelDisplay.Text
                      ? level.toString() + ':'
                      : this.options.logLevelDisplay === LogLevelDisplay.Icon
                        ? LogLevelIcon[level]
                        : '',
                  logLevel: level.toString(),
                  message: message,
                }) +
                Style.Reset,
            );
            break;

          case Format.text:
          default:
            console.log(
              this.options.logColors[level] +
                (this.options.prefix.getPrefix() === ''
                  ? ''
                  : '[' + this.options.prefix.getPrefix() + ']'),
              this.options.logLevelDisplay === LogLevelDisplay.Text
                ? level.toString() + ':'
                : this.options.logLevelDisplay === LogLevelDisplay.Icon
                  ? LogLevelIcon[level]
                  : '',

              message + Style.Reset,
            );
            break;
        }
  }
}
