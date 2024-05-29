import { Injectable } from '@nestjs/common';
import * as math from 'mathjs';

@Injectable()
export class OddsConverterService {
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
      return moneyline > 0
        ? moneyline / 100 + 1
        : (100 / Math.abs(moneyline) + 1).toPrecision(3);
    },
    toFractional: function (moneyline: any) {
      return math.format(
        moneyline > 0
          ? math.fraction(moneyline / 100)
          : math.fraction(100 / Math.abs(moneyline)),
        { fraction: 'ratio' },
      );
    },
  };
}
