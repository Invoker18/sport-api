import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { Repository } from 'typeorm';
import { DATABASE_ENUM } from '../../../config/database/enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

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
    return '';
  }

  /**
    EXEC [VZ_GetPlayerBalance]
    @prmIdPlayer int
  */
  async getBalance(params: any) {
    let cacheTimeSec = 2;
    let player_id = params.player_id;
    // **CHECK CACHE
    const key = `get_playerBalance_${player_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.playerRepository.query(
      `EXEC VZ_GetPlayerBalance	${player_id}`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }
  /**

  */
  async getInfo(params: any) {
    return '';
  }
}
