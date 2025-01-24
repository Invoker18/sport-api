import { Injectable } from '@nestjs/common';

@Injectable()
export class DataService {
  async mappingGames(games: any) {
    const dataGames = [];
    const glength = games.length;
    for (let i = 0; i < glength; i++) {
      dataGames.push(await this.mappingGame(games[i]));
    }
    return dataGames;
  }

  async mappingGame(game: any) {
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
      Options,
      ...info
    } = game;
    let lines: any;
    if (!['TNT', 'PROP'].includes(game.IdSport)) {
      lines = {
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
      const line_str = lines.TotalOver?.toString();
      lines.TotalOver =
        line_str && line_str != 0 && !['-'].includes(line_str.charAt(0))
          ? Number('-' + line_str)
          : line_str;
    } else lines = Options;

    return { info, lines };
  }
}
