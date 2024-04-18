import {
  Controller,
  Get,
  Header,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WagerService } from './wager.service';
// import { BookIdValidatorPipe } from './pipes/book-id-validator.pipe'
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiInternalServerErrorResponse,
  ApiNotAcceptableResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKeyAuth } from '../../../decorator/auth.decorator';
import { GetActiveLeaguesQuery } from './dto/get-leagues.dto';
import { TransformInterceptor } from '../../../interceptor/transform.interceptor';
import { GetGamesByLeaguesQuery } from './dto/get-game-by-leagues.dto';

@Controller('proxy/wager')
@ApiKeyAuth()
@ApiTags('proxyWager')
export class WagerController {
  constructor(private readonly wagerService: WagerService) {}

  @Get('leagues')
  @Header('Content-Type', 'application/json')
  @UseInterceptors(TransformInterceptor)
  async getActiveLeagues(
    @Query() params: GetActiveLeaguesQuery,
  ): Promise<string> {
    let response: any;
    if (params.active == 1) {
      response = await this.wagerService.GetActiveLeagues({
        IdBook: params.book_id,
        IdProfile: params.profile_id,
        IdLineType: params.line_type_id,
        WagerType: params.wager_type_id,
        Language: params.lang_id,
      });
    } else {
      response = await this.wagerService.GetAnonActiveLeagues({
        IdBook: params.book_id,
      });
    }
    return response;
  }

  @Get('games_by_leagues')
  @Header('Content-Type', 'application/json')
  @UseInterceptors(TransformInterceptor)
  async getGamesByLeagueId(
    @Query() params: GetGamesByLeaguesQuery,
  ): Promise<string> {
    return await this.wagerService.GetScheduleUTC({
        IdBook: params.book_id,
        IdProfile: params.profile_id,
        IdProfileLimits: params.profile_limits_id,
        IdLineType: params.line_type_id,
        NHLLine: params.nhl_line,
        MLBLine: params.mlb_line,
        LineStyle: params.line_style,
        WagerType: params.wager_type,
        StrIdLeagues: params.str_id_leagues,
        IdWagerType: params.wager_type_id,
        Language: params.lang_id,
        UTC: params.utc,
        IdAgent: params.agent_id,
      });
  }
}
