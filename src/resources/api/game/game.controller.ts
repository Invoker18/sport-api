import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../../../interceptor/transform.interceptor';
import { ApiKeyAuth } from '../../../decorator/auth.decorator';
import { GameService } from './game.service';
import { GetGamesByLeaguesQuery } from './dto/get-game-by-leagues.dto';

@Controller('game')
@ApiKeyAuth()
@ApiTags('API Game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
  ) {}

  @Get('/league')
  @UseInterceptors(TransformInterceptor)
  async getGamesByLeague(
    @Query() params: GetGamesByLeaguesQuery,
  ): Promise<string> {
    return await this.gameService.getGamesByLeagues(params);
  }
}
