import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import { DATABASE_ENUM } from '../../../config/database/enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PlayerService } from '../player/player.service';
import { LeagueService } from '../league/league.service';

@Injectable()
export class GameService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @InjectRepository(Game, DATABASE_ENUM.MSSQL_DGS)
    private gameRepository: Repository<Game>,
    private player: PlayerService,
    private league: LeagueService,
  ) {}

  async getGamesByLeagues(params: any) {
    const cacheTimeSec = 1;
    const league_ids = params.league_id;
    const player_id = params.player_id;
    const lang_id = params.lang_id;
    const period = params.period;
    const player = await this.player.getInfo({ player_id: player_id });
    const agent_id = player.IdAgent;
    const line_type_id = player.IdLineType;

    // **CHECK CACHE
    const key = `get_game_by_league_${league_ids}_${player_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);

    if (cached) return cached;
    // **CHECK CACHE

    let data: any = [];
    const leaguelength = league_ids.length;
    for (let i = 0; i < leaguelength; i++) {
      const league_id = league_ids[i];

      let games = await this.getOpenGamesLeague({
        league_id,
        agent_id,
        line_type_id,
        lang_id,
        period,
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

  async getGame(params: any) {
    const cacheTimeSec = 10;
    const game_id = params.game_id;
    const lang_id = params.lang_id;

    // **CHECK CACHE
    const key = `get_game_${game_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.gameRepository.query(
      `EXEC VZ_GetGame	${game_id}, ${lang_id}`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data[0], cacheTimeSec * 1000);
    // **SET CACHE

    return data[0];
  }

  async searchGames(params: any) {
    const cacheTimeSec = 10;
    const search = params.search;
    const player = await this.player.getInfo({ player_id: params.player_id });
    const book_id = player.IdBook;
    const line_type_id = player.IdLineType;
    const lang_id = params.lang_id;

    // **CHECK CACHE
    const key = `search_games_${search}_${book_id}_${line_type_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.gameRepository.query(
      `EXEC VZ_SearchGames	${search}, ${book_id}, ${line_type_id}, ${lang_id}`,
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
    const period = params.period ?? -1;

    // **CHECK CACHE
    const key = `get_open_games_leagues_${league_id}_${agent_id}_${line_type_id}_${lang_id}_${period}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.gameRepository.query(
      `EXEC VZ_GetOpenGamesLeague	${league_id},${agent_id},${line_type_id},${lang_id},${period}`,
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
    const period = params.period;
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
      period,
    });

    let data: any = {
      info: await this.getGame({ game_id: family_game_id, lang_id }),
      events: [],
    };
    const glength = games.length;
    for (let i = 0; i < glength; i++) {
      const game = games[i];
      const sport_id = (game.IdSport = game.IdSport.trim());
      const game_id = game.IdGame;

      switch (sport_id) {
        case 'TNT':
          game.Options = await this.getGameTNTOdds({
            game_id,
            line_type_id,
            lang_id,
          });
          break;
        case 'PROP':
          game.Options = await this.getGamePROPOdds({
            game_id,
            line_type_id,
            lang_id,
          });
          break;
      }
      if (['TNT', 'PROP'].includes(sport_id) && game.Options.length == 0)
        continue;
      data.events.push(game);
    }

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
    const period = params.period ?? -1;

    // **CHECK CACHE
    const key = `get_open_games_family_${family_game_id}_${agent_id}_${line_type_id}_${lang_id}_${period}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE
    const data = await this.gameRepository.query(
      `EXEC VZ_GetOpenFamilyGames	${family_game_id},${agent_id},${line_type_id},${lang_id},${period}`,
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
    const key = `get_game_tnt_odds_${game_id}_${line_type_id}_${lang_id}`;
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
  async getGamePROPOdds(params: any) {
    const cacheTimeSec = 1;
    const game_id = params.game_id;
    const line_type_id = params.line_type_id;
    const lang_id = params.lang_id;

    // **CHECK CACHE
    const key = `get_game_prop_odds_${game_id}_${line_type_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE
    const data = await this.gameRepository.query(
      `EXEC VZ_GetGamePROPOdds	${game_id},${line_type_id},${lang_id}`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }
  async getGamesByWebRow(params: any) {
    const cacheTimeSec = 1;
    const player_id = params.player_id;
    const lang_id = params.lang_id;
    const start_date = params.start_date;
    const end_date = params.end_date;
    const period = params.period;
    const league_ids = params.league_ids;
    const player = await this.player.getInfo({ player_id: player_id });
    const agent_id = player.IdAgent;
    const line_type_id = player.IdLineType;
    const book_id = player.IdBook;
    const webrows = await this.league.getActiveWebRow({
      book_id,
      line_type_id,
      lang_id,
    });
    const webrow_ids =
      params.webrow_id != -1
        ? params.webrow_id
        : webrows.map((a: any) => a.IdWebRow);

    // **CHECK CACHE
    const key = `get_game_by_webrow_${webrow_ids}_${player_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);

    if (cached) return cached;
    // **CHECK CACHE

    let data: any = [];
    const webrowlength = webrow_ids.length;
    for (let i = 0; i < webrowlength; i++) {
      const webrow_id = webrow_ids[i];
      const games = await this.getOpenGamesWebRowDate({
        webrow_id,
        agent_id,
        line_type_id,
        lang_id,
        start_date,
        end_date,
        period,
        league_ids,
      });

      const league_map = new Map();
      const glength = games.length;
      for (let g = 0; g < glength; g++) {
        const game = games[g];
        const league_id = game.IdLeague;

        const collection = league_map.get(league_id);
        if (!collection) {
          let league = await this.getLeague({
            league_id,
            lang_id,
          });
          let banner = await this.getLeagueBanners({
            league_id,
            lang_id,
          });
          league_map.set(league_id, {
            league: Object.values(league)[0] ?? league,
            banner: banner,
            games: [game],
          });
        } else {
          collection.games.push(game);
        }
      }
      if (league_map.size) {
        const f_wr = webrows.find((wr: any) => wr.IdWebRow == webrow_id);
        data.push({
          webrow_id: webrow_id,
          webrow: f_wr.RowDescription,
          leagues: Object.values(Object.fromEntries(league_map.entries())),
        });
      }
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
    const period = params.period ?? -1;
    const league_ids = params.league_ids ?? -1;
    // **CHECK CACHE
    const key = `get_open_games_webrow_rangedate_${webrow_id}_${agent_id}_${line_type_id}_${lang_id}_${start_date}_${end_date}_${period}_${league_ids}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE
    const data = await this.gameRepository.query(
      `EXEC VZ_GetOpenGamesWebRowDate	${webrow_id},${agent_id},${line_type_id},${lang_id},'${start_date}','${end_date}',${period},'${league_ids}'`,
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
