import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { League } from './entities/league.entity';
import { Repository } from 'typeorm';
import { DATABASE_ENUM } from 'src/config/database/enum';
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
    let book_id = params.book_id;
    let line_type_id = params.line_type_id;
    let lang_id = params.lang_id;
    // **CHECK CACHE
    const key = `get_leagues_active_${book_id}_${line_type_id}_${lang_id}`;
    const leaguesCached = await this.cacheService.get(key);
    if (leaguesCached) return leaguesCached;
    // **CHECK CACHE

    const data = await this.leagueRepository.query(
      `EXEC VZ_GetActiveLeagues	${book_id},${line_type_id},${lang_id}`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, 10 * 1000);
    // **SET CACHE

    return data;
  }

  findAll() {
    return `This action returns all league`;
  }

  findOne(id: number) {
    return `This action returns a #${id} league`;
  }
}
