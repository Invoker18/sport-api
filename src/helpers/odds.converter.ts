const Fraction = require('fractional-arithmetic').Fraction;

export const OddsDecimal = {
  toAmerican: function (decimal: any) {
    return decimal < 2.0
      ? (-100 / (decimal - 1)).toPrecision(5)
      : ((decimal - 1) * 100).toPrecision(5);
  },
  toFractional: function (decimal: any) {
    return new Fraction(decimal - 1);
  },
};

export const OddsFraction = {
  toAmerican: function (fraction: any) {
    const [n, d] = fraction.split('/');
    return n > d ? (n / d) * 100 : -100 / (n / d);
  },
  toDecimal: function (fraction: any) {
    const [n, d] = fraction.split('/');
    return n / d + 1;
  },
};

export const OddsAmerican = {
  toDecimal: function (moneyline: any) {
    return moneyline > 0
      ? moneyline / 100 + 1
      : (100 / Math.abs(moneyline) + 1).toPrecision(3);
  },
  toFractional: function (moneyline: any) {
    return moneyline > 0
      ? new Fraction(moneyline / 100)
      : new Fraction(100 / Math.abs(moneyline));
  },
};
