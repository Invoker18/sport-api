import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import { DATABASE_ENUM } from '../../../config/database/enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PlayerService } from '../player/player.service';
import { Odds } from 'src/lib/odds';
// import { OddsAmerican } from 'src/helpers/odds.converter';

@Injectable()
export class GameService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @InjectRepository(Game, DATABASE_ENUM.MSSQL_DGS)
    private gameRepository: Repository<Game>,
    private player: PlayerService,
  ) {}

  async getGamesByLeagues(params: any) {
    const cacheTimeSec = 1;
    const league_ids = params.league_id;
    const player_id = params.player_id;
    const lang_id = params.lang_id;
    const player = await this.player.getInfo({ player_id: player_id });
    const agent_id = player.IdAgent;
    const line_type_id = player.IdLineType;

    // // American to Decimal
    // console.log('American to Decimal',OddsAmerican.toDecimal(225)); // 3.25

    // console.log('American to Decimal',OddsAmerican.toDecimal(-110)); // 1.91

    // // American to Fraction
    // console.log('American to Fraction',OddsAmerican.toFractional(225).simplify()); // (9/4)

    // console.log('American to Fraction',OddsAmerican.toFractional(-125).simplify()); // (4/5)

    // let odds = new Odds(1.5);

    // odds = Odds.fromUS(-285);
    // console.log(odds.decimalOdds); // 4
    // console.log(odds.usOdds); // 300
    // console.log(odds.usOddsString); // "+300"
    // console.log(odds.fractionOdds); // "3/1"
    // console.log(odds.impliedProbability); // 0.25
    // console.log(odds.impliedProbabilityString); // "25%"

    // **CHECK CACHE
    const key = `get_game_by_league_${league_ids}_${player_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);

    if (cached) return cached;
    // **CHECK CACHE

    let data: any = [];
    for (const league_id of league_ids) {
      let games = await this.getOpenGamesLeague({
        league_id,
        agent_id,
        line_type_id,
        lang_id,
      });
      let league = await this.getLeague({
        league_id,
        lang_id,
      });
      let banner = await this.getLeagueBanners({
        league_id,
        lang_id,
      });
      if (games[0]) {
        data.push({
          league: Object.values(league)[0] ?? league,
          banner: banner,
          games: games,
        });
      }
    }

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async getLeague(params: any) {
    const cacheTimeSec = 10;
    const league_id = params.league_id;
    const lang_id = params.lang_id;

    // **CHECK CACHE
    const key = `get_league_${league_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.gameRepository.query(
      `EXEC VZ_GetLeague	${league_id}, ${lang_id}`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async getLeagueBanners(params: any) {
    const cacheTimeSec = 10;
    const league_id = params.league_id;
    const lang_id = params.lang_id;

    // **CHECK CACHE
    const key = `get_league_banners_${league_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.gameRepository.query(
      `EXEC VZ_GetLeagueBanners	${league_id}, ${lang_id}`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async getOpenGamesLeague(params: any) {
    const cacheTimeSec = 1;
    const league_id = params.league_id;
    const agent_id = params.agent_id;
    const line_type_id = params.line_type_id;
    const lang_id = params.lang_id;

    // **CHECK CACHE
    const key = `get_open_games_leagues_${league_id}_${agent_id}_${line_type_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.gameRepository.query(
      `EXEC VZ_GetOpenGamesLeague	${league_id},${agent_id},${line_type_id},${lang_id}`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async getFamilyGames(params: any) {
    const cacheTimeSec = 1;
    const family_game_id = params.family_game_id;
    const player_id = params.player_id;
    const lang_id = params.lang_id;
    const player = await this.player.getInfo({ player_id: player_id });
    const agent_id = player.IdAgent;
    const line_type_id = player.IdLineType;

    // **CHECK CACHE
    const key = `get_family_game_${family_game_id}_${player_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);

    if (cached) return cached;
    // **CHECK CACHE

    const games = await this.getOpenGamesFamily({
      family_game_id,
      agent_id,
      line_type_id,
      lang_id,
    });

    const map = new Map();
    for (const game of games) {
      const sport_id = (game.IdSport = game.IdSport.trim());
      const game_id = game.IdGame;

      switch (sport_id) {
        case 'TNT':
          game.Odds = await this.getGameTNTOdds({
            game_id,
            line_type_id,
            lang_id,
          });
          break;
        case 'PROP':
          break;
      }

      const collection = map.get(sport_id);
      if (!collection) {
        map.set(sport_id, [game]);
      } else {
        collection.push(game);
      }
    }
    let data: any = Object.fromEntries(map.entries());

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async getOpenGamesFamily(params: any) {
    const cacheTimeSec = 1;
    const family_game_id = params.family_game_id;
    const agent_id = params.agent_id;
    const line_type_id = params.line_type_id;
    const lang_id = params.lang_id;

    // **CHECK CACHE
    const key = `get_open_games_family_${family_game_id}_${agent_id}_${line_type_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE
    const data = await this.gameRepository.query(
      `EXEC VZ_GetOpenFamilyGames	${family_game_id},${agent_id},${line_type_id},${lang_id}`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async getGameTNTOdds(params: any) {
    const cacheTimeSec = 1;
    const game_id = params.game_id;
    const line_type_id = params.line_type_id;
    const lang_id = params.lang_id;

    // **CHECK CACHE
    const key = `get_game_tnt_odss_${game_id}_${line_type_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE
    const data = await this.gameRepository.query(
      `EXEC VZ_GetGameTNTOdds	${game_id},${line_type_id},${lang_id}`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async getGamesByWebRow(params: any) {
    const cacheTimeSec = 1;
    const webrow_ids = params.webrow_id;
    const player_id = params.player_id;
    const lang_id = params.lang_id;
    const start_date = params.start_date;
    const end_date = params.end_date;
    const player = await this.player.getInfo({ player_id: player_id });
    const agent_id = player.IdAgent;
    const line_type_id = player.IdLineType;

    // **CHECK CACHE
    const key = `get_game_by_webrow_${webrow_ids}_${player_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);

    if (cached) return cached;
    // **CHECK CACHE

    let data: any = [];
    for (const webrow_id of webrow_ids) {
      let games = await this.getOpenGamesWebRowDate({
        webrow_id,
        agent_id,
        line_type_id,
        lang_id,
        start_date,
        end_date,
      });

      const map = new Map();
      for (const game of games) {
        const league_id = game.IdLeague;

        const collection = map.get(league_id);
        if (!collection) {
          let league = await this.getLeague({
            league_id,
            lang_id,
          });
          let banner = await this.getLeagueBanners({
            league_id,
            lang_id,
          });
          map.set(league_id, {
            league: Object.values(league)[0] ?? league,
            banner: banner,
            games: [game],
          });
        } else {
          collection.games.push(game);
        }
      }
      data.push({
        webrow_id: webrow_id,
        leagues: Object.fromEntries(map.entries()),
      });
    }

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async getOpenGamesWebRowDate(params: any) {
    const cacheTimeSec = 1;
    const webrow_id = params.webrow_id;
    const agent_id = params.agent_id;
    const line_type_id = params.line_type_id;
    const lang_id = params.lang_id;
    const start_date = new Date(params.start_date).toISOString();
    const end_date = new Date(params.end_date).toISOString();
    // **CHECK CACHE
    const key = `get_open_games_webrow_rangedate_${webrow_id}_${agent_id}_${line_type_id}_${lang_id}_${start_date}_${end_date}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE
    const data = await this.gameRepository.query(
      `EXEC VZ_GetOpenGamesWebRowDate	${webrow_id},${agent_id},${line_type_id},${lang_id},'${start_date}','${end_date}'`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async getOddsConversionDGS() {
    const cacheTimeSec = 30;
    // **CHECK CACHE
    const key = `get_odds_conversion_dgs`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE
    const data = await this.gameRepository.query(`EXEC VZ_GetOddsConversion`);

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }
}
