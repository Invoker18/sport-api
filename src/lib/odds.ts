import { getFraction, logger, round } from './utils';

export enum OddsType {
  US = 'us',
  FRACTION = 'frac',
  DECIMAL = 'dec',
}

export enum FractionOddsDivider {
  SLASH = '/',
  HYPHEN = '-',
}

/**
 * Class for converting betting odds
 *
 * @export
 * @class Odds
 */
export class Odds {
  fractionOddsDivider: string = FractionOddsDivider.SLASH;
  decimalPlaces = 3;
  _decimalOdds: number;

  /**
   * Create an Odds object
   *
   * @param decimalOdds Decimal odds to instantiate the class
   */
  constructor(decimalOdds: number) {
    if (decimalOdds <= 1) {
      throw new RangeError('Input odds must be greater than 1');
    }
    this._decimalOdds = decimalOdds;
  }

  /**
   * Gets the decimal odds tidied
   *
   * @readonly
   * @memberof Odds
   */
  get decimalOdds() {
    return round(this._decimalOdds, this.decimalPlaces);
  }

  /**
   * Get the US odds
   *
   * @readonly
   * @memberof Odds
   */
  get usOdds() {
    return this._decimalOdds > 2
      ? round((this._decimalOdds - 1) * 100, 5)
      : round(-100 / (this._decimalOdds - 1), 5);
  }

  /**
   * Get the US odds as a formatted string
   *
   * @readonly
   * @memberof Odds
   */
  get usOddsString() {
    return this.usOdds > 0 ? `+${this.usOdds}` : `${this.usOdds}`;
  }

  /**
   * Gets the implied probability
   *
   * @readonly
   * @memberof Odds
   */
  get impliedProbability() {
    return 1 / this._decimalOdds;
  }

  /**
   * Gets the implied probability as a formatted string
   *
   * @readonly
   * @memberof Odds
   */
  get impliedProbabilityString() {
    return `${parseFloat(
      (this.impliedProbability * 100).toFixed(this.decimalPlaces),
    )}%`;
  }

  /**
   * Gets the fraction odds
   *
   * @readonly
   * @memberof Odds
   */
  get fractionOdds() {
    return getFraction(this._decimalOdds - 1, this.fractionOddsDivider);
  }

  /**
   * Gets the reciprocal odds object
   *
   * @readonly
   * @returns {Odds}
   */
  get reciprocalOdds() {
    return new Odds(1 / (this.decimalOdds - 1) + 1);
  }

  /**
   * Create an Odds object from a US odds number or string
   *
   * @static
   * @param {(number | string)} usOdds
   * @returns {Odds}
   * @memberof Odds
   */
  static fromUS(usOdds: number | string): Odds {
    const usOddsNumeric =
      typeof usOdds === 'string' ? parseFloat(usOdds) : usOdds;
    let decimalOdds: number | null = null;
    if (usOddsNumeric > 0) {
      decimalOdds = 1 + usOddsNumeric / 100;
    } else if (usOddsNumeric < 0) {
      decimalOdds = 1 - 100 / usOddsNumeric;
    } else {
      throw new RangeError(`US Odds value of ${usOdds} is invalid`);
    }
    return new Odds(decimalOdds);
  }

  static fromFraction(oddsFractionString: string): Odds {
    for (const fractionDivider of Object.values(FractionOddsDivider)) {
      if (oddsFractionString.includes(fractionDivider)) {
        const oddsParts = oddsFractionString.split(fractionDivider);
        const decimalOdds = parseInt(oddsParts[0]) / parseInt(oddsParts[1]) + 1;
        return new Odds(Number(decimalOdds));
      }
    }
    throw new Error(`Input string must contain a fraction divider`);
  }

  /**
   * Produces an Odds object from a string. It will guess the type.
   *
   * @static
   * @param {string} oddsString
   * @returns {Odds}
   * @memberof Odds
   */
  static fromString(oddsString: string): Odds {
    logger.info(`Received value ${oddsString}`);
    const type = Odds.guessType(oddsString);
    if (type === OddsType.US) {
      logger.info('Guessed US type odds string');
      return Odds.fromUS(oddsString);
    }
    if (type === OddsType.DECIMAL) {
      logger.info('Guessed Decimal type odds string');
      return new Odds(Number(oddsString));
    }
    if (type === OddsType.FRACTION) {
      logger.info('Guessed Fraction type odds string');
      return Odds.fromFraction(oddsString);
    }
    throw Error(`Cannot find type for ${oddsString}`);
  }

  /**
   * Has a guess at the type of odds given input from a string
   *
   * @static
   * @param {string} odds
   * @returns {OddsType}
   * @memberof Odds
   */
  static guessType(odds: string): OddsType {
    if (odds.startsWith('+') || odds.startsWith('-')) {
      return OddsType.US;
    }
    for (const fractionDivider of Object.values(FractionOddsDivider)) {
      if (odds.includes(fractionDivider)) {
        return OddsType.FRACTION;
      }
    }
    if (Number(odds)) {
      return OddsType.DECIMAL;
    }
    throw new Error(`${odds} does not seem to be a valid odds string`);
  }
}
