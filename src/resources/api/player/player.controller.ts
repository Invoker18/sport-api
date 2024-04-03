import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../../../interceptor/transform.interceptor';
import { ApiKeyAuth } from '../../../decorator/auth.decorator';
import { IdPlayerParam } from './dto/get_player.dto';
import { PlayerService } from './player.service';

@Controller('player')
@ApiKeyAuth()
@ApiTags('API Player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  // @Post()
  // @UseInterceptors(TransformInterceptor)
  // async login(@Query() params: LoginParams): Promise<string> {
  //   return await this.playerService.login(params);
  // }

  @Get(':player_id/balance')
  @UseInterceptors(TransformInterceptor)
  async getBalance(@Param() params: IdPlayerParam): Promise<string> {
    console.log(params);
    return await this.playerService.getBalance(params);
  }

  // @Get()
  // @UseInterceptors(TransformInterceptor)
  // async getInfo(@Query() params: IdPlayerParam): Promise<string> {
  //   return await this.playerService.getInfo(params);
  // }
}

// exec GetPlayerForLogin @UserName='DWP-10'
// go
// declare @p6 int
// set @p6=377544
// exec CreateCall @IdPlayer=21595,@PhoneLine=-1,@IdUser=0,@IP='0.0.0.0',@System='I',@IdCall=@p6 output,@URL=''
// select @p6
// go
// exec WebGetPlayerOnline @IdPlayer=21595
// go
