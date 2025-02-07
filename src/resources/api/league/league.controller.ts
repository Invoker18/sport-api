import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetActiveLeaguesQuery } from './dto/get-leagues.dto';
import { LeagueService } from './league.service';
@Controller('league')
@ApiTags('API League')
export class LeagueController {
  constructor(private readonly leagueService: LeagueService) {}

  @Get()
  async getActiveLeagues(
    @Query() params: GetActiveLeaguesQuery,
  ): Promise<string> {
    return await this.leagueService.getActiveLeagues(params);
  }

  @Get('webrow')
  async getActiveWebRow(
    @Query() params: GetActiveLeaguesQuery,
  ): Promise<string> {
    return await this.leagueService.getActiveWebRow(params);
  }
}
