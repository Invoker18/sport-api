import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../../../interceptor/transform.interceptor';
import { ApiKeyAuth } from '../../../decorator/auth.decorator';
import { IdPlayerParam } from './dto/get_player.dto';
import { PlayerService } from './player.service';
import { LoginParams } from './dto/login.dto';

@Controller('player')
@ApiKeyAuth()
@ApiTags('API Player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('login')
  @UseInterceptors(TransformInterceptor)
  async login(@Body() params: LoginParams): Promise<string> {
    return await this.playerService.login(params);
  }

  @Get(':player_id/balance')
  @UseInterceptors(TransformInterceptor)
  async getBalance(@Param() params: IdPlayerParam): Promise<string> {
    console.log(params);
    return await this.playerService.getBalance(params);
  }

  @Get(':player_id/info')
  @UseInterceptors(TransformInterceptor)
  async getInfo(@Param() params: IdPlayerParam): Promise<string> {
    return await this.playerService.getInfo(params);
  }
}
