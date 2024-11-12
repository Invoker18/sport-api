import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Timezone } from './entities/timezone.entity';
import { Repository } from 'typeorm';
import { DATABASE_ENUM } from '../../../config/database/enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TimezoneService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @InjectRepository(Timezone, DATABASE_ENUM.MSSQL_DGS)
    private timezoneRepository: Repository<Timezone>,
  ) {}

  async getTimeZones() {
    const cacheTimeSec = 300;

    // **CHECK CACHE
    const key = `get_timeZones`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.timezoneRepository.query(`EXEC WebGetTimeZones`);

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }
}
