import { Injectable } from '@nestjs/common';
import * as math from 'mathjs';

@Injectable()
export class OddsConvertionService {
  private points = [
    'TotalOver',
    'TotalUnder',
    'VisitorSpread',
    'HomeSpread',
    'VisitorSpecial',
    'HomeSpecial',
  ];
  private oddsEven = [
    'VisitorSpreadOdds',
    'HomeSpreadOdds',
    'OverOdds',
    'UnderOdds',
  ];
  constructor() {}

  OddsDecimal = {
    toAmerican: function (decimal: any) {
      return decimal < 2.0
        ? (-100 / (decimal - 1)).toPrecision(5)
        : ((decimal - 1) * 100).toPrecision(5);
    },
    toFractional: function (decimal: any) {
      return math.format(math.fraction(decimal - 1), { fraction: 'ratio' });
    },
  };

  OddsFraction = {
    toAmerican: function (fraction: any) {
      const [n, d] = fraction.split('/');
      return n > d ? (n / d) * 100 : -100 / (n / d);
    },
    toDecimal: function (fraction: any) {
      const [n, d] = fraction.split('/');
      return n / d + 1;
    },
  };

  OddsAmerican = {
    toDecimal: function (moneyline: any) {
      return (
        moneyline > 0 ? moneyline / 100 + 1 : 100 / Math.abs(moneyline) + 1
      ).toPrecision(3);
    },
    toMixedFractional: function (line: any) {
      const p = line.toString().split('.');
      const fract = p[1] ? math.fraction('0.' + p[1]) : '';
      return fract
        ? (['0', '-0', '+0'].includes(p[0]) ? p[0].replace('0', '') : p[0]) +
            '&frac' +
            fract.n +
            fract.d
        : line;
    },
    toFractional: function (moneyline: any) {
      return math.format(
        math.fraction(
          (moneyline > 0
            ? moneyline / 100
            : 100 / Math.abs(moneyline)
          ).toPrecision(3),
        ),
        { fraction: 'ratio' },
      );
    },
  };

  private setPoints(line_str: string, k: string) {
    line_str = line_str
      ? (k == 'TotalOver'
          ? 'o'
          : k == 'TotalUnder'
            ? 'u'
            : !['-', '+'].includes(line_str.charAt(0))
              ? '+'
              : '') + line_str
      : line_str;
    // points
    return line_str ? this.OddsAmerican.toMixedFractional(line_str) : line_str;
  }

  public setAllLinesConvert(lines: any, odds_dgs: any) {
    const newLine = {
      original: lines,
      american: {},
      decimal: {},
      fractional: {},
    };
    for (const [k, line] of Object.entries(lines)) {
      const line_str = line?.toString();
      if (this.points.includes(k)) {
        newLine.american[k] =
          newLine.decimal[k] =
          newLine.fractional[k] =
            this.setPoints(line_str, k);
        newLine.original[k] =
          k == 'TotalOver' &&
          line_str &&
          line != 0 &&
          !['-'].includes(line_str.charAt(0))
            ? '-' + line_str
            : line_str;
      } else {
        const odd_dgs = odds_dgs.find((odd: any) => odd.American == line_str);
        newLine.american[k] = this.oddsFormatAmerican(line_str, k);
        newLine.decimal[k] = this.oddsAmericanToDecimal(line_str, odd_dgs);
        newLine.fractional[k] = this.oddsAmericanToFractional(
          line_str,
          odd_dgs,
        );
      }
    }
    return newLine;
  }

  public setAllLinesConvertTNTPROP(options: any, odds_dgs: any) {
    const newLine = {
      original: options,
      american: [],
      decimal: [],
      fractional: [],
    };

    const optlength = options.length;
    for (let i = 0; i < optlength; i++) {
      const option = options[i];
      const dataAmerican = { ...option };
      const dataDecimal = { ...option };
      const dataFractional = { ...option };
      const line_str = option.Odds?.toString();
      const odd_dgs = odds_dgs.find((odd: any) => odd.American == line_str);

      dataAmerican.Odds = this.oddsFormatAmerican(line_str);
      newLine.american.push(dataAmerican);

      dataDecimal.Odds = this.oddsAmericanToDecimal(line_str, odd_dgs);
      newLine.decimal.push(dataDecimal);

      dataFractional.Odds = this.oddsAmericanToFractional(line_str, odd_dgs);
      newLine.fractional.push(dataFractional);
    }
    return newLine;
  }

  private oddsFormatAmerican(line_str: string, k: string = '') {
    // odds
    if (this.oddsEven.includes(k) && line_str == '100') return 'EVEN';
    return line_str && !['-', '+'].includes(line_str.charAt(0))
      ? '+' + line_str
      : line_str;
  }

  private oddsAmericanToDecimal(line_str: string, odd_dgs: any) {
    // odds
    return odd_dgs && odd_dgs.Decimal
      ? odd_dgs.Decimal.toString()
      : line_str
        ? this.OddsAmerican.toDecimal(line_str)
        : line_str;
  }

  private oddsAmericanToFractional(line_str: string, odd_dgs: any) {
    // odds
    return odd_dgs && odd_dgs.Fractional
      ? odd_dgs.Fractional.toString()
      : line_str
        ? this.OddsAmerican.toFractional(line_str)
        : line_str;
  }
}
