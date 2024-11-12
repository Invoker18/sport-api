import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeyAuth } from '../../../decorator/auth.decorator';
import { IdPlayerParam } from './dto/get_player.dto';
import { PlayerService } from './player.service';
import { LoginParams } from './dto/login.dto';
import { DateRangeParam } from './dto/daterange.dto';
import { UpdatePlayerInfo } from './dto/update_player_info.dto';

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

  @Get(':player_id/history/wagers')
  async getHistoryWagers(
    @Param() params: IdPlayerParam,
    @Query() daterange: DateRangeParam,
  ): Promise<string> {
    return await this.playerService.getHistoryWagers({
      player_id: params.player_id,
      daterange,
    });
  }

  @Get(':player_id/history/transactions')
  async getHistoryTransactions(
    @Param() params: IdPlayerParam,
    @Query() daterange: DateRangeParam,
  ): Promise<string> {
    return await this.playerService.getHistoryTransactions({
      player_id: params.player_id,
      daterange,
    });
  }

  @Put('info')
  async updatePlayerInfo(@Body() params: UpdatePlayerInfo): Promise<string> {
    return await this.playerService.updatePlayerInfo(params);
  }
}
