import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { LeagueService } from '../league/league.service';
import { GetGamesByLeaguesQuery } from './dto/get-game-by-leagues.dto';
import { GetGamesByWebRowQuery } from './dto/get-game-by-webrow.dto';
import { searchGamesQuery } from './dto/search-games.dto';
import { GetFamilyGamesQuery } from './dto/get-game-family.dto';
import { GetGamesByGameIdsQuery } from './dto/get-game-by-gameids.dto';
import { GetActiveWebRowByDateQuery } from './dto/get-active-webRrow_by_date.dto';

@Controller('game')
@ApiTags('API Game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly leagueService: LeagueService,
  ) {}

  @Get('/')
  async getGames(
    @Query()
    params: GetGamesByGameIdsQuery,
  ): Promise<string> {
    return await this.gameService.getGamesByGameIds(params);
  }

  @Get('/league')
  async getGamesByLeague(
    @Query()
    params: GetGamesByLeaguesQuery,
  ): Promise<string> {
    return await this.gameService.getGamesByLeagues(params);
  }
  @Get('/webrow')
  async getGamesByWebRow(
    @Query()
    params: GetGamesByWebRowQuery,
  ): Promise<string> {
    return await this.gameService.getGamesByWebRow(params);
  }

  @Get('/only_webrow')
  async getActiveWebRowByDate(
    @Query()
    params: GetActiveWebRowByDateQuery,
  ): Promise<string> {
    return await this.leagueService.getActiveWebRowByDate(params);
  }

  @Get('/family')
  async getFamilyGames(
    @Query()
    params: GetFamilyGamesQuery,
  ): Promise<string> {
    return await this.gameService.getFamilyGames(params);
  }

  // @Get('/odds/dgs-conversion')
  // async getOddsConversionDGS(): Promise<string> {
  //   return await this.gameService.getOddsConversionDGS();
  // }

  @Get('/search')
  async searchGamesLeagues(
    @Query()
    params: searchGamesQuery,
  ) {
    return await this.gameService.searchGamesLeagues(params);
  }
}
