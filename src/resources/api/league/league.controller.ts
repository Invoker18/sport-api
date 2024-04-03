import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../../../interceptor/transform.interceptor';
import { ApiKeyAuth } from '../../../decorator/auth.decorator';
import { GetActiveLeaguesQuery } from './dto/get-leagues.dto';
import { LeagueService } from './league.service';
@Controller('league')
@ApiKeyAuth()
@ApiTags('API League')
export class LeagueController {
  constructor(private readonly leagueService: LeagueService) {}

  @Get()
  @UseInterceptors(TransformInterceptor)
  async getActiveLeagues(
    @Query() params: GetActiveLeaguesQuery,
  ): Promise<string> {
    return await this.leagueService.getActiveLeagues(params);
  }
}
