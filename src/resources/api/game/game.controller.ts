import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeyAuth } from '../../../decorator/auth.decorator';
import { GameService } from './game.service';
import { GetGamesByLeaguesQuery } from './dto/get-game-by-leagues.dto';
import { GetGamesByWebRowQuery } from './dto/get-game-by-webrow.dto';
import { searchGamesQuery } from './dto/search-games.dto';
import { GetFamilyGamesQuery } from './dto/get-game-family.dto';

@Controller('game')
@ApiKeyAuth()
@ApiTags('API Game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

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

  @Get('/family')
  async getFamilyGames(
    @Query()
    params: GetFamilyGamesQuery,
  ): Promise<string> {
    return await this.gameService.getFamilyGames(params);
  }

  @Get('/odds/dgs-conversion')
  async getOddsConversionDGS(): Promise<string> {
    return await this.gameService.getOddsConversionDGS();
  }

  @Get('/search')
  async searchGamesLeagues(
    @Query()
    params: searchGamesQuery,
  ) {
    return await this.gameService.searchGamesLeagues(params);
  }
}
