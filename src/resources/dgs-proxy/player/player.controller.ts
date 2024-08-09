import { Controller, Get, Header, Query } from '@nestjs/common';
import { PlayerService } from './player.service';
import { ApiTags } from '@nestjs/swagger';
import { GetRegisterQuery } from './dto/register.dto';

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
}
