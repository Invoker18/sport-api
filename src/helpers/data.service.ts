import { Injectable } from '@nestjs/common';
import { OddsService } from 'src/resources/api/odds/odds.service';
import { OddsConvertionService } from './odds-convertion.service';

@Injectable()
export class DataService {
  private odds_dgs: any;
  constructor(
    private readonly odds: OddsConvertionService,
    private readonly oddsService: OddsService,
  ) {
    this.init();
  }

  private async init() {
    this.odds_dgs = await this.oddsService.getOddsConversionDGS();
  }

  async mappingGames(games: any, line_style = 'E') {
    const dataGames = [];
    const glength = games.length;
    for (let i = 0; i < glength; i++) {
      dataGames.push(await this.mappingGame(games[i], line_style));
    }

    return dataGames;
  }

  async mappingGame(game: any, line_style = 'E') {
    const {
      VisitorOdds,
      HomeOdds,
      TotalOver,
      OverOdds,
      TotalUnder,
      UnderOdds,
      VisitorSpread,
      VisitorSpreadOdds,
      HomeSpread,
      HomeSpreadOdds,
      VisitorSpecial,
      VisitorSpecialOdds,
      HomeSpecial,
      HomeSpecialOdds,
      // Options,
      ...info
    } = game;

    const lines = {
      VisitorOdds,
      HomeOdds,
      TotalOver,
      OverOdds,
      TotalUnder,
      UnderOdds,
      VisitorSpread,
      VisitorSpreadOdds,
      HomeSpread,
      HomeSpreadOdds,
      VisitorSpecial,
      VisitorSpecialOdds,
      HomeSpecial,
      HomeSpecialOdds,
    };

    return {
      info: info,
      line: !['TNT', 'PROP'].includes(game.IdSport)
        ? this.odds.setAllLinesConvert(lines, this.odds_dgs, line_style)
        : this.odds.setAllLinesConvertTNTPROP(
            game.Options,
            this.odds_dgs,
            line_style,
          ),
    };
  }
}
