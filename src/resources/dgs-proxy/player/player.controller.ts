import { Controller, Get, Header, Param, Query } from '@nestjs/common';
import { PlayerService } from './player.service';
import { ApiTags } from '@nestjs/swagger';
import { GetRegisterQuery } from './dto/register.dto';
import { GetOpenbetsQuery } from './dto/openbets.dto';
import { GetHistoryQuery } from './dto/history.dto';

@Controller('proxy/player')
@ApiTags('proxyPlayer')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('register')
  @Header('Content-Type', 'application/json')
  async register(@Query() params: GetRegisterQuery): Promise<string> {
    let response: any;
    response = await this.playerService.register(params);
    return response;
  }

  @Get(':prmIdPlayer/openbets')
  async getPlayerOpenBets(@Param() params: GetOpenbetsQuery): Promise<string> {
    return await this.playerService.GetPlayerOpenBets(params);
  }

  @Get(':prmIdPlayer/history/:Mode')
  async getPlayerHistory(@Param() params: GetHistoryQuery): Promise<string> {
    return await this.playerService.GetPlayerHistory(params);
  }
}
