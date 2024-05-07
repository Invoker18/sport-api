import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import { DATABASE_ENUM } from '../../../config/database/enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PlayerService } from '../player/player.service';

@Injectable()
export class GameService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @InjectRepository(Game, DATABASE_ENUM.MSSQL_DGS)
    private gameRepository: Repository<Game>,
    private player: PlayerService,
  ) {}

  /**
    EXEC [VZ_GetGamesByLeagues]

  */
  async getGamesByLeagues(params: any) {
    const cacheTimeSec = 1;
    const league_ids = params.league_id;
    const player_id = params.player_id;
    const lang_id = params.lang_id;
    const player: any = Object.values(
      await this.player.getInfo({ player_id: player_id }),
    )[0];
    const agent_id = player.IdAgent;
    const line_type_id = player.IdLineType;

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
      data.push({
        league: Object.values(league)[0] ?? league,
        banner: banner,
        games: games,
      });
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
}
