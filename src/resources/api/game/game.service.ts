import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import { DATABASE_ENUM } from '../../../config/database/enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PlayerService } from '../player/player.service';
import { LeagueService } from '../league/league.service';
import { DataService } from 'src/helpers/data.service';

@Injectable()
export class GameService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @InjectRepository(Game, DATABASE_ENUM.MSSQL_DGS)
    private gameRepository: Repository<Game>,
    private player: PlayerService,
    private league: LeagueService,
    private readonly dataService: DataService,
  ) {}

  async processGame(game, line_type_id, lang_id) {
    try {
      if (!game) {
        return null;
      }

      const sport_id = game.IdSport.trim();
      const game_id = game.IdGame;
      switch (sport_id) {
        case 'TNT':
          game.Options = (
            await this.getGameTNTOddsByFamilyGameId({
              family_game_id: game_id,
              line_type_id,
              lang_id,
            })
          ).filter((o) => o.IdGame === game_id);
          break;
        case 'PROP':
          game.Options = await this.getGamePROPOdds({
            game_id,
            line_type_id,
            lang_id,
          });
          if (game.Options.length === 0) return;
          break;
      }
      return this.dataService.mappingGame(game);
    } catch (error) {
      console.error(`Error processing game ${game.IdGame}:`, error);
      return null;
    }
  }

  async getGamesByGameIds(params: any) {
    const cacheTimeSec = 3;
    const game_ids = params.game_ids;
    const player_id = params.player_id;
    const lang_id = params.lang_id;

    // **CHECK CACHE
    const key = `get_game_by_game_ids_${game_ids}_${player_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const player = await this.player.getInfo({ player_id: player_id });
    const agent_id = player.IdAgent;
    const line_type_id = player.IdLineType;

    let _games = await this.getOpenGamesByGamesIds({
      game_ids,
      agent_id,
      line_type_id,
      lang_id,
    });

    const gamePromises = _games.map((game) =>
      this.processGame(game, line_type_id, lang_id),
    );
    const gameResults = await Promise.all(gamePromises);
    const games = gameResults.filter(Boolean); // Filter out null results

    const success_ids = games.map((game) => game.info.IdGame.toString() ?? []);
    const rejected_ids = game_ids.filter((x: any) => !success_ids.includes(x));

    const data: any = {
      rejected_ids,
      games,
    };

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async processLeague(
    league_id,
    agent_id,
    line_type_id,
    lang_id,
    period,
    timezone,
  ) {
    try {
      const league_promises = [
        this.getOpenGamesLeague({
          league_id,
          agent_id,
          line_type_id,
          lang_id,
          period,
        }),
        this.getLeague({ league_id, lang_id }),
        this.getLeagueBanners({ league_id, lang_id }),
      ];

      const [games, league, banner] = await Promise.all(league_promises);

      if (games.length === 0) {
        return null;
      }

      const events = {};

      const glength = games.length;
      for (let g = 0; g < glength; g++) {
        let game = games[g];
        game.banners = banner.filter((b) => b.ParentGame === game.IdGame);

        let _main;
        if (games.some((_game) => _game.IdGame === game.FamilyGame)) {
          _main = games.find((_game) => _game.IdGame === game.FamilyGame);
        } else {
          _main = await this.getGame({ game_id: game.FamilyGame, lang_id });
        }

        const sport_id = game.IdSport.trim();
        const game_id = game.IdGame;

        switch (sport_id) {
          case 'TNT':
            game.Options = (
              await this.getGameTNTOddsByFamilyGameId({
                family_game_id: game_id,
                line_type_id,
                lang_id,
              })
            ).filter((o) => o.IdGame === game_id);
            break;
          case 'PROP':
            game.Options = await this.getGamePROPOdds({
              game_id,
              line_type_id,
              lang_id,
            });
            if (game.Options.length === 0) continue;
            break;
        }

        game.GameDateTimeMain = game.GameDateTimeMain ?? game.GameDateTime;
        const _GameDateTime = new Date(game.GameDateTimeMain);
        game.GameDateTimeZone = _GameDateTime.toLocaleString('sv-SE', {
          timeZone: timezone,
        });
        const date = _GameDateTime.toLocaleDateString('sv-SE', {
          timeZone: timezone,
        });

        if (!events[date]) {
          events[date] = {};
        }
        const _events = await this.dataService.mappingGame(game);
        const _key_familygame = '_' + game.FamilyGame;
        if (!events[date][_key_familygame]) {
          events[date][_key_familygame] = {
            info: _main,
            events: [_events],
          };
        } else {
          events[date][_key_familygame].events.push(_events);
        }
      }

      return {
        league: Object.values(league)[0] ?? league,
        banner: banner,
        games: events,
      };
    } catch (error) {
      console.error(`Error processing league ${league_id}:`, error);
      return null;
    }
  }

  async getGamesByLeagues(params: any) {
    const cacheTimeSec = 3;
    const league_ids = params.league_id;
    const player_id = params.player_id;
    const lang_id = params.lang_id;
    const period = params.period;
    const timezone = params.timezone;

    // **CHECK CACHE
    const key = `get_game_by_league_${league_ids}_${player_id}_${lang_id}_${period}_${timezone}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const player = await this.player.getInfo({ player_id: player_id });
    const agent_id = player.IdAgent;
    const line_type_id = player.IdLineType;

    const leaguePromises = league_ids.map((league_id) =>
      this.processLeague(
        league_id,
        agent_id,
        line_type_id,
        lang_id,
        period,
        timezone,
      ),
    );

    const leagueResults = await Promise.all(leaguePromises);
    const data: any = leagueResults.filter(Boolean); // Filter out null results

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async getFamilyGames(params: any) {
    const cacheTimeSec = 3;
    const family_game_id = params.family_game_id;
    const player_id = params.player_id;
    const lang_id = params.lang_id;
    const period = params.period;

    // **CHECK CACHE
    const key = `get_family_game_${family_game_id}_${player_id}_${lang_id}_${period}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const player = await this.player.getInfo({ player_id: player_id });
    const agent_id = player.IdAgent;
    const line_type_id = player.IdLineType;

    const _data_promises = [
      this.getOpenGamesFamily({
        family_game_id,
        agent_id,
        line_type_id,
        lang_id,
        period,
      }),
      this.getGameTNTOddsByFamilyGameId({
        family_game_id,
        line_type_id,
        lang_id,
      }),
      this.getGamePROPOddsByFamilyGameId({
        family_game_id,
        line_type_id,
        lang_id,
      }),
      this.getGameBannersByFamilyGameId({
        family_game_id,
        lang_id,
      }),
      this.getGame({ game_id: family_game_id, lang_id }),
    ];
    const [games, optionsTNT, optionsPROPS, banners, _game_info] =
      await Promise.all(_data_promises);

    let data: any = { info: _game_info, events: [] };

    const glength = games.length;
    for (let g = 0; g < glength; g++) {
      let game = games[g];
      const sport_id = (game.IdSport = game.IdSport.trim());
      const game_id = game.IdGame;
      game.banners = banners.filter(
        (banner: any) => banner.ParentGame === game_id,
      );

      switch (sport_id) {
        case 'TNT':
          game.Options = optionsTNT.filter(
            (option: any) => option.IdGame === game_id,
          );
          break;
        case 'PROP':
          game.Options = optionsPROPS.filter(
            (option: any) => option.ParentGame === game_id,
          );
          if (game.Options.length === 0) continue;
          break;
      }
      data.events.push(await this.dataService.mappingGame(game));
    }

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async processGroupGames(
    games: any[],
    lang_id: string,
    timezone: string,
    groupby = '',
  ): Promise<any> {
    let _games_data = {};
    const league_map = new Map();
    const glength = games.length;
    for (let g = 0; g < glength; g++) {
      let game = games[g];
      game.GameDateTimeMain = game.GameDateTimeMain ?? game.GameDateTime;
      const _GameDateTime = new Date(game.GameDateTimeMain);
      game.GameDateTimeZone = _GameDateTime.toLocaleString('sv-SE', {
        timeZone: timezone,
      });
      const date = _GameDateTime.toLocaleDateString('sv-SE', {
        timeZone: timezone,
      });
      const _key_familygame = '_' + game.FamilyGame;
      const league_id = game.IdLeague;

      const _data_promises = [
        this.getLeagueBanners({ league_id, lang_id }),
        this.dataService.mappingGame(game),
      ];
      const [banner, _game] = await Promise.all(_data_promises);

      game.banners = banner.filter(
        (banner) => banner.ParentGame === game.IdGame,
      );

      if (groupby === 'leagues') {
        _games_data = league_map.get(league_id);

        if (!_games_data) {
          const league = {
            IDLeagueRegion: game.IDLeagueRegion,
            IdLeague: game.IdLeague,
            LeagueOrder: game.LeagueOrder,
            IdSport: game.IdSport,
            Description: game.LeagueLangDescription,
            ShortDescription: game.ShortDescription,
            RegionDescription: game.RegionDescription,
            LeagueDescription: game.LeagueLangDescription,
          };
          _games_data = {
            league,
            banner,
            games: {},
          };
          league_map.set(league_id, _games_data);
        }
      }

      if (!_games_data[date]) {
        _games_data[date] = {};
      }

      if (!_games_data[date][_key_familygame]) {
        const _main = games.find((_game) => _game.IdGame === game.FamilyGame);
        _games_data[date][_key_familygame] = {
          info:
            _main ||
            (await this.getGame({ game_id: game.FamilyGame, lang_id })),
          events: [_game],
        };
      } else {
        _games_data[date][_key_familygame].events.push(_game);
      }
    }

    return groupby === 'leagues'
      ? league_map.size
        ? Object.values(Object.fromEntries(league_map.entries()))
        : []
      : _games_data;
  }

  async getGamesByWebRow(params: any) {
    const cacheTimeSec = 3;
    const player_id = params.player_id;
    const lang_id = params.lang_id;
    const start_date = params.start_date;
    const end_date = params.end_date;
    const period = params.period;
    const league_ids = params.league_ids;
    const group_by = params.group_by;
    const limit = params.limit;
    const timezone = params.timezone;

    let webrow_ids = params.webrow_id;

    // **CHECK CACHE
    const key = `get_game_by_webrow_${webrow_ids}_${player_id}_${lang_id}_${start_date}_${end_date}_${period}_${league_ids}_${group_by}_${limit}_${timezone}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const player = await this.player.getInfo({ player_id: player_id });
    const agent_id = player.IdAgent;
    const line_type_id = player.IdLineType;
    const book_id = player.IdBook;

    if (webrow_ids == -1) {
      const webrows = await this.league.getActiveWebRowByDate({
        book_id,
        line_type_id,
        lang_id,
        league_ids,
        start_date,
        end_date,
      });
      webrow_ids = webrows.map((a: any) => a.IdWebRow);
    }

    let gamesData = await this.getOpenGamesWebRowDate({
      webrow_ids,
      agent_id,
      line_type_id,
      lang_id,
      start_date,
      end_date,
      period,
      league_ids,
      limit,
    });

    let data: any;
    if (group_by != 'none') {
      const promisesWebRow = webrow_ids.map(async (webrow_id: number) => {
        let games = gamesData.filter(
          (_game: any) => _game.IdWebRow === Number(webrow_id),
        );

        return {
          webrow_id: webrow_id,
          webrow: games[0]?.RowLangDescription,
          _list: await this.processGroupGames(
            games,
            lang_id,
            timezone,
            group_by,
          ),
        };
      });
      data = await Promise.all(promisesWebRow);
    } else {
      data = await this.processGroupGames(gamesData, lang_id, timezone);
    }

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async searchGamesLeagues(params: any) {
    const player = await this.player.getInfo({
      player_id: params.player_id,
    });
    params.book_id = player.IdBook;
    params.line_type_id = player.IdLineType;
    const _search_promises = [
      this.searchGames(params),
      this.searchLeagues(params),
    ];
    const [games, leagues] = await Promise.all(_search_promises);
    return { games, leagues };
  }

  async searchGames(params: any) {
    const cacheTimeSec = 60;
    const search = params.search;
    const lang_id = params.lang_id;
    const book_id = params.book_id;
    const line_type_id = params.line_type_id;

    // **CHECK CACHE
    const key = `search_games_${search}_${book_id}_${line_type_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.gameRepository.query(
      `EXEC VZ_SearchGames	'${search}', ${book_id}, ${line_type_id}, ${lang_id}`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async searchLeagues(params: any) {
    const cacheTimeSec = 60;
    const search = params.search;
    const lang_id = params.lang_id;
    const book_id = params.book_id;
    const line_type_id = params.line_type_id;

    // **CHECK CACHE
    const key = `search_leagues_${search}_${book_id}_${line_type_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.gameRepository.query(
      `EXEC VZ_SearchLeagues	'${search}', ${book_id}, ${line_type_id}, ${lang_id}`,
    );

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
    const cacheTimeSec = 30;
    const game_id = params.game_id;
    const lang_id = params.lang_id;

    // **CHECK CACHE
    const key = `get_game_${game_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data =
      (
        await this.gameRepository.query(`EXEC VZ_GetGame	${game_id}, ${lang_id}`)
      )[0] ?? '';

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async getLeagueBanners(params: any) {
    const cacheTimeSec = 60;
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

  async getGameBanners(params: any) {
    const cacheTimeSec = 60;
    const game_id = params.game_id;
    const lang_id = params.lang_id;

    // **CHECK CACHE
    const key = `get_game_banners_${game_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.gameRepository.query(
      `EXEC VZ_GetGameBanners	${game_id}, ${lang_id}`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async getGameBannersByFamilyGameId(params: any) {
    const cacheTimeSec = 60;
    const family_game_id = params.family_game_id;
    const lang_id = params.lang_id;

    // **CHECK CACHE
    const key = `get_game_family_banners_${family_game_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.gameRepository.query(
      `EXEC VZ_GetGameBannersByIdFamilyGame	${family_game_id}, ${lang_id}`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }
  async getOpenGamesLeague(params: any) {
    const cacheTimeSec = 3;
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

  async getOpenGamesByGamesIds(params: any) {
    const cacheTimeSec = 3;
    const game_ids = params.game_ids;
    const agent_id = params.agent_id;
    const line_type_id = params.line_type_id;
    const lang_id = params.lang_id;

    // **CHECK CACHE
    const key = `get_open_games_leagues_${game_ids}_${agent_id}_${line_type_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.gameRepository.query(
      `EXEC VZ_GetOpenGamesByIdGames	'${game_ids}',${agent_id},${line_type_id},${lang_id}`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async getOpenGamesFamily(params: any) {
    const cacheTimeSec = 3;
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

  async getGameTNTOddsByFamilyGameId(params: any) {
    const cacheTimeSec = 3;
    const family_game_id = params.family_game_id;
    const line_type_id = params.line_type_id;
    const lang_id = params.lang_id;

    // **CHECK CACHE
    const key = `get_game_tnt_odds_family_game_${family_game_id}_${line_type_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE
    const data = await this.gameRepository.query(
      `EXEC VZ_GetGameTNTOddsByIdFamilyGame	${family_game_id},${line_type_id},${lang_id}`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async getGamePROPOddsByFamilyGameId(params: any) {
    const cacheTimeSec = 1;
    const family_game_id = params.family_game_id;
    const line_type_id = params.line_type_id;
    const lang_id = params.lang_id;

    // **CHECK CACHE
    const key = `get_game_prop_odds_family_game_${family_game_id}_${line_type_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE
    const data = await this.gameRepository.query(
      `EXEC VZ_GetGamePROPOddsByIdFamilyGame	${family_game_id},${line_type_id},${lang_id}`,
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

  async getOpenGamesWebRowDate(params: any) {
    const cacheTimeSec = 3;
    const webrow_ids = params.webrow_ids;
    const agent_id = params.agent_id;
    const line_type_id = params.line_type_id;
    const lang_id = params.lang_id;
    const start_date = new Date(params.start_date).toISOString();
    const end_date = new Date(params.end_date).toISOString();
    const period = params.period ?? -1;
    const league_ids = params.league_ids ?? -1;
    const limit = params.limit;
    // **CHECK CACHE
    const key = `get_open_games_webrow_rangedate_${webrow_ids}_${agent_id}_${line_type_id}_${lang_id}_${start_date}_${end_date}_${period}_${league_ids}_${limit}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE
    const data = await this.gameRepository.query(
      `EXEC VZ_GetOpenGamesWebRowDate	'${webrow_ids}',${agent_id},${line_type_id},${lang_id},'${start_date}','${end_date}',${period},'${league_ids}',${limit}`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }
}
