import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { Repository } from 'typeorm';
import { DATABASE_ENUM } from '../../../config/database/enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { any } from 'joi';

@Injectable()
export class PlayerService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @InjectRepository(Player, DATABASE_ENUM.MSSQL_DGS)
    private playerRepository: Repository<Player>,
  ) {}

  /**

  */
  async login(params: any) {
    const user = params.user;
    const password = params.password;
    const book_id = params.book_id;
    const ip = params.ip;

    const player = await this.getPlayerByUserName({ user });

    if (!player) {
      throw new NotFoundException(`Invalid user ${user}. Not found`);
    } else if (player.OnlineAccess != 1 || player.IdBook != book_id) {
      throw new UnauthorizedException(
        `Player ${user} doesnt have Online Access. Contact Customer Services.`,
      );
    } else if (player.UserName != user || player.OnlinePassword != password) {
      throw new UnauthorizedException(`Invalid user name or password.`, {
        cause: new Error(),
        description: 'Credentials',
      });
    }
    const balance = await this.getBalance({ player_id: player.IdPlayer });
    const info = await this.getInfo({ player_id: player.IdPlayer });
    info.IdCall =
      (
        await this.createCallInDGS({
          player_id: player.IdPlayer,
          ip,
        })
      ).IdCall ?? 0;
    const data: any = { balance, info };
    return data;
  }

  /**
    EXEC [VZ_CreateCall]
    @prmIdPlayer int,
    @prmIP varchar(100)
  */
  async createCallInDGS(params: any) {
    const cacheTimeSec = 1;
    const player_id = params.player_id;
    const ip = params.ip;

    // **CHECK CACHE
    const key = `get_createCallInDGS_${player_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = (
      await this.playerRepository.query(
        `EXEC VZ_CreateCall ${player_id}, '${ip}'`,
      )
    )[0];

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  /**
    EXEC [VZ_GetPlayerBalance]
    @prmIdPlayer int
  */
  async getPlayerByUserName(params: any) {
    const cacheTimeSec = 1;
    const user = params.user;

    // **CHECK CACHE
    const key = `get_playerByUserName_${user}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = (
      await this.playerRepository.query(`EXEC GetPlayerForLogin	'${user}'`)
    )[0];

    if (!data) {
      throw new NotFoundException(`Player ${user}. Not found`);
    }

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  /**
    EXEC [VZ_GetPlayerBalance]
    @prmIdPlayer int
  */
  async getBalance(params: any) {
    const cacheTimeSec = 2;
    const player_id = params.player_id;
    // **CHECK CACHE
    const key = `get_playerBalance_${player_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = (
      await this.playerRepository.query(`EXEC VZ_GetPlayerBalance	${player_id}`)
    )[0];

    if (!data) {
      throw new NotFoundException(`IdPlayer ${player_id}. Not found`);
    }

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  /**
    EXEC [VZ_GetPlayerInfo]
    @prmIdPlayer int
  */
  async getInfo(params: any) {
    const cacheTimeSec = 2;
    const player_id = params.player_id;
    // **CHECK CACHE
    const key = `get_playerInfo_${player_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = (
      await this.playerRepository.query(`EXEC VZ_GetPlayerInfo ${player_id}`)
    )[0];

    if (!data) {
      throw new NotFoundException(`IdPlayer ${player_id}. Not found`);
    }
    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  /**
    EXEC [WebGetPlayerHistoryWagers]
    @prmIdPlayer int
    @prmStartDate datetime
    @prmEndDate datetime
  */
  async getHistoryWagers(params: any) {
    const cacheTimeSec = 2;
    const player_id = params.player_id;
    const from_date = params.daterange.from_date;
    const to_date = params.daterange.to_date;
    // **CHECK CACHE
    const key = `get_playerHistory_${player_id}_${from_date}_${to_date}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.playerRepository.query(
      `EXEC VZ_GetPlayerHistoryWagers ${player_id}, "${from_date}", "${to_date}"`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  /**
    EXEC [GetPlayerHistoryTransac]
    @prmIdPlayer int
    @prmStartDate datetime
    @prmEndDate datetime
  */
  async getHistoryTransactions(params: any) {
    const cacheTimeSec = 2;
    const player_id = params.player_id;
    const from_date = params.daterange.from_date;
    const to_date = params.daterange.to_date;
    // **CHECK CACHE
    const key = `get_playerHistoryTransactions_${player_id}_${from_date}_${to_date}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.playerRepository.query(
      `EXEC VZ_GetPlayerHistoryTransac ${player_id}, "${from_date}", "${to_date}"`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async getGameLineByPlayerId(params: any) {
    const cacheTimeSec = 2;
    const player_id = params.player_id;
    const game_id = params.game_id;
    const play = params.play;

    // **CHECK CACHE
    const key = `get_gameLineByPlayerId_${player_id}_${game_id}_${play}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.playerRepository.query(
      `EXEC VZ_GetGameLineByPlayerId ${player_id}, ${game_id}, ${play}`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async getLanguages() {
    const cacheTimeSec = 300;

    // **CHECK CACHE
    const key = `get_languageCultureInfo`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.playerRepository.query(
      `EXEC WebGetLanguageCultureInfo`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async getTimeZones() {
    const cacheTimeSec = 300;

    // **CHECK CACHE
    const key = `get_timeZones`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.playerRepository.query(`EXEC WebGetTimeZones`);

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }
}
