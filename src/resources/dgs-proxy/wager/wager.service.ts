import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { round } from 'mathjs';
import { FetchService } from '../../../helpers/fetch.service';

@Injectable()
export class WagerService {
  private readonly name = 'ProxyWager.asmx';
  private readonly proxy_url: string;
  constructor(
    private readonly config: ConfigService,
    private readonly helper: FetchService,
  ) {
    this.proxy_url = config.get('dgs').proxy_url + this.name;
  }

  /** Process bets  */
  async WagerProcess(params: any) {
    /**
     * COMPILE
     */
    let compile = await this.WagerCompile(
      {
        prmdetails: params.details,
        IdPlayer: params.player_id,
        IdCall: params.call_id,
        WagerType: params.wager_type,
        OpenSpots: params.open_spots,
        IdWagerType: params.wager_type_id,
        FixTeaserLine: params.fix_teaser_line,
      },
      !(params.process_type == 'compile'),
    );

    if (
      params.process_type == 'compile' ||
      (compile.hasOwnProperty('status') && compile.status === 'error')
    )
      return compile;

    /**
     * CONFIRM
     */
    let $xml = compile.replace('Amount="0"', 'Amount="' + params.amount + '"');
    $xml = $xml.replace('RiskWin="0"', 'RiskWin="' + params.riskwin + '"'); //value win 1 or risk  2
    $xml = $xml.replace(
      'RoundRobinCombinations="0"',
      'RoundRobinCombinations="' + params.round_robin + '"',
    );

    let confirm = await this.WagerConfirm(
      {
        slip: $xml,
        prmdetails: params.extra_details,
      },
      !(params.process_type == 'confirm'),
    );

    if (
      params.process_type == 'confirm' ||
      (confirm.hasOwnProperty('status') && confirm.status === 'error')
    )
      return confirm;

    /**
     * POST
     */
    let post = await this.WagerPost({
      slip: confirm,
      Password: params.password,
    });

    if (
      params.process_type == 'post' ||
      (post.hasOwnProperty('status') && post.status === 'error')
    )
      return post;

    return '';
  }

  /**
    prmdetails String Details of the wager on a format(“IdGame,Play,Points,Odds”) and each detail separate by “@-@”.
    IdPlayer Integer Player identification number from table DGSDATA.PLAYER field IdPlayer.
    IdCall Integer Call identification number from table DGSDATA.WAGERHEADER field IdCall.
    WagerType Byte Wager Type identification code from table DGSDATA.WAGERTYPE field WagerType.
    OpenSpots Byte Number of open spots on the Wager.
    IdWagerType Integer Wager Type Identification code from table DGSDATA.WAGERTYPE field IdWagerType.
    FixTeaserLine Boolean
  */
  async WagerCompile(params: object, returnXML: boolean) {
    const requestUrl = this.proxy_url + '/WagerCompile2';
    return this.helper.FetchProxy(
      'POST',
      params,
      requestUrl,
      'index',
      returnXML,
    );
  }

  async WagerConfirm(params: object, returnXML: boolean) {
    const requestUrl = this.proxy_url + '/WagerConfirm';
    return this.helper.FetchProxy(
      'POST',
      params,
      requestUrl,
      'index',
      returnXML,
    );
  }

  async WagerPost(params: object) {
    const requestUrl = this.proxy_url + '/WagerPost';
    return this.helper.FetchProxy('POST', params, requestUrl);
  }
  /** end Process bets */

  async GetActiveLeagues(params: object) {
    const requestUrl = this.proxy_url + '/GetActiveLeagues';
    return this.helper.FetchProxy('POST', params, requestUrl);
  }

  async GetAnonActiveLeagues(params: object) {
    const requestUrl = this.proxy_url + '/GetAnonActiveLeagues';
    return this.helper.FetchProxy('POST', params, requestUrl);
  }

  async GetScheduleUTC(params: object) {
    const requestUrl = this.proxy_url + '/GetScheduleUTC';
    return this.helper.FetchProxy('POST', params, requestUrl, 'league');
  }

  async GetTeasers() {}

  async GetVersion() {}

  async RBLGradeBet() {}

  async RBLInsertBet() {}

  async RBLUnGradeBet() {}

  async FillCompile() {}

  async GetFillOpenWager() {}

  async GetScheduleForGames() {}

  async GetSchedule() {}

  async GetFamilygames() {}

  async GetNewScheduleUTC() {}

  async GetNewSchedule() {}

  async GetParlays() {}

  async GetUpcomingGames() {}

  async WagerRemove() {}

  async WagerUpdateLines() {}

  async WagerValidate() {}
}
