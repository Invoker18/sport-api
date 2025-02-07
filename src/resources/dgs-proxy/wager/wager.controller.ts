import { Controller, Get, Header, Query } from '@nestjs/common';
import { WagerService } from './wager.service';
// import { BookIdValidatorPipe } from './pipes/book-id-validator.pipe'
import { ApiTags } from '@nestjs/swagger';
import { GetActiveLeaguesQuery } from './dto/get-leagues.dto';
import { GetGamesByLeaguesQuery } from './dto/get-game-by-leagues.dto';
import { WagerQuery } from './dto/wager-query.dto';
import { GetTeasersQuery } from './dto/get-teasers.dto';
import { FillOpenWagerQuery } from './dto/fillopen-wager-query.dto';
import { FillOpenQuery } from './dto/fillopen-query.dto';

@Controller('proxy/wager')
@ApiTags('proxyWager')
export class WagerController {
  constructor(private readonly wagerService: WagerService) {}

  @Get('leagues')
  @Header('Content-Type', 'application/json')
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

  @Get('betslip/process')
  @Header('Content-Type', 'application/json')
  async wagerProcess(@Query() params: WagerQuery): Promise<string> {
    let response: any;
    response = await this.wagerService.WagerProcess(params);
    return response;
  }

  @Get('fillopenbet/process')
  @Header('Content-Type', 'application/json')
  async fillOpenBetProcess(
    @Query() params: FillOpenWagerQuery,
  ): Promise<string> {
    let response: any;
    response = await this.wagerService.FillOpenWagerProcess(params);
    return response;
  }

  @Get('fillopenbet')
  @Header('Content-Type', 'application/json')
  async fillOpenBet(@Query() params: FillOpenQuery): Promise<string> {
    let response: any;
    response = await this.wagerService.GetFillOpenWager(params);
    return response;
  }

  @Get('teasers')
  @Header('Content-Type', 'application/json')
  async getTeasers(@Query() params: GetTeasersQuery): Promise<string> {
    let response: any;
    response = await this.wagerService.GetTeasers({
      IdProfile: params.profile_id,
    });
    return response;
  }
}
