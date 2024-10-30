import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeyAuth } from '../../../decorator/auth.decorator';
import { IdPlayerParam } from './dto/get_player.dto';
import { PlayerService } from './player.service';
import { LoginParams } from './dto/login.dto';
import { DateRangeParam } from './dto/daterange.dto';

@Controller('player')
@ApiKeyAuth()
@ApiTags('API Player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('login')
  async login(@Body() params: LoginParams): Promise<string> {
    return await this.playerService.login(params);
  }

  @Get(':player_id/balance')
  async getBalance(@Param() params: IdPlayerParam): Promise<string> {
    console.log(params);
    return await this.playerService.getBalance(params);
  }

  @Get(':player_id/info')
  async getInfo(@Param() params: IdPlayerParam): Promise<string> {
    return await this.playerService.getInfo(params);
  }

  @Get(':player_id/history')
  async getHistory(
    @Param() params: IdPlayerParam,
    @Query() daterange: DateRangeParam,
  ): Promise<string> {
    return await this.playerService.getHistory({
      player_id: params.player_id,
      daterange,
    });
  }
}
