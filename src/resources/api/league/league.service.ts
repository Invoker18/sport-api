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
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(League, DATABASE_ENUM.MSSQL_DGS)
    private leagueRepository: Repository<League>,
  ) {}

  // param WebGetActiveLeagues
  // @IdBook smallint,	@IdLineType smallint,	@WagerType tinyint
  async find(params: any) {
    // **CHECK CACHE
    const key = 'get_leagues_active';
    const leaguesCached = await this.cacheManager.get(key);
    if (leaguesCached) return leaguesCached;
    // **CHECK CACHE

    const data = await this.leagueRepository.query(
      `EXEC WebGetActiveLeagues	${params.book_id},1,0`,
    );

    // **SET CACHE
    await this.cacheManager.set(key, data, 10 * 1000);
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
