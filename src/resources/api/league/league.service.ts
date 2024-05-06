import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { League } from './entities/league.entity';
import { Repository } from 'typeorm';
import { DATABASE_ENUM } from '../../../config/database/enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class LeagueService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @InjectRepository(League, DATABASE_ENUM.MSSQL_DGS)
    private leagueRepository: Repository<League>,
  ) {}

  /**
    EXEC [VZ_GetActiveLeagues]
    @prmIdBook smallint, 
    @prmIdLineType smallint,	
    @prmIdLanguage tinyint
  */
  async getActiveLeagues(params: any) {
    const cacheTimeSec = 10;
    const book_id = params.book_id;
    const line_type_id = params.line_type_id;
    const lang_id = params.lang_id;
    // **CHECK CACHE
    const key = `get_leagues_active_${book_id}_${line_type_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.leagueRepository.query(
      `EXEC VZ_GetActiveLeagues	${book_id},${line_type_id},${lang_id}`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  async getActiveWebRow(params: any) {
    const cacheTimeSec = 30;
    const book_id = params.book_id;
    const line_type_id = params.line_type_id;
    const lang_id = params.lang_id;
    // **CHECK CACHE
    const key = `get_webrow_active_${book_id}_${line_type_id}_${lang_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.leagueRepository.query(
      `EXEC VZ_GetActiveWebRow	${book_id},${line_type_id},${lang_id}`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }
}
