import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DATABASE_ENUM } from '../../../config/database/enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Odds } from './entities/odds.entity';

@Injectable()
export class OddsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @InjectRepository(Odds, DATABASE_ENUM.MSSQL_DGS)
    private oddsRepository: Repository<Odds>,
  ) {}

  async getOddsConversionDGS() {
    const cacheTimeSec = 30;
    // **CHECK CACHE
    const key = `get_odds_conversion_dgs`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE
    const data = await this.oddsRepository.query(`EXEC VZ_GetOddsConversion`);

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }
}
