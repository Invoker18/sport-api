import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { jsonToXML } from 'src/helpers/cast.helper';
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
    let compile = await this.WagerCompile({
      prmdetails: params.details,
      IdPlayer: params.player_id,
      IdCall: params.call_id,
      WagerType: params.wager_type,
      OpenSpots: params.open_spots,
      IdWagerType: params.wager_type_id,
      FixTeaserLine: params.fix_teaser_line,
    });

    if (
      params.process_type == 'compile' ||
      (compile.hasOwnProperty('status') && compile.status === 'error')
    )
      return compile;

    /**
     * CONFIRM
     */
    //SET DATA
    compile = await this.setDataToConfirm(compile, params);
    let confirm = await this.WagerConfirm({
      slip: jsonToXML(compile),
      prmdetails: params.extra_details,
    });
    if (
      params.process_type == 'confirm' ||
      (confirm.hasOwnProperty('status') && confirm.status === 'error')
    )
      return confirm;

    /**
     * POST
     */
    let post = await this.WagerPost({
      slip: jsonToXML(confirm),
      Password: params.password,
    });

    if (
      params.process_type == 'post' ||
      (post.hasOwnProperty('status') && post.status === 'error')
    )
      return post;

    return '';
  }

  async setDataToConfirm(compile: any, params: any) {
    const wagerlength = compile?.wager.length;
    const amount = JSON.parse(params.amount);
    const amountlength = amount.length;
    if (wagerlength > 0) {
      for (let i = 0; i < amountlength; i++) {
        for (let j = 0; j < wagerlength; j++) {
          const detail = compile.wager[j].detail;
          if (amount[i].id == detail.IdGame && amount[i].play == detail.Play) {
            compile.wager[j].Amount = amount[i].amount;
            compile.wager[j].RiskWin = amount[i].rw;
          }
        }
      }
    } else {
      compile.wager.Amount = amount.amount;
      compile.wager.RiskWin = amount.rw;
      if (params.wager_type == 5) {
        // ROUNDROBIN
        compile.wager.RoundRobinCombinations = params.round_robin;
      } else if (params.wager_type == 15) {
        // COMPACTROUNDROBIN
        compile.wager.CompactCombinations = params.round_robin;
      }
    }
    return compile;
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
  async WagerCompile(params: object) {
    const requestUrl = this.proxy_url + '/WagerCompile2';
    return await this.helper.FetchProxy('POST', params, requestUrl, 'index');
  }

  /**
    slip String XML result for the Wager Compile.
    prmdetails String Details of the wager on a format(“IdGame,Play,OptionType,OptionParameter”) and each detail separate by “@-@”. This field can be empty
    
    *Notes:
    OptionType = 0 then The OptionParameter indicates the buy points for the game line.
    OptionType = 1 then The OptionParameter indicates the selected pitcher for the game line.
    For the Pitcher Selection are:
    0: The User Pitcher is Action.
    1: The User Pitcher is Visitor.
    2: The User Pitcher is Home.
    3: The User Pitcher is Listed.
  */
  async WagerConfirm(params: object) {
    const requestUrl = this.proxy_url + '/WagerConfirm';
    return await this.helper.FetchProxy('POST', params, requestUrl, 'index');
  }
  /**
    slip String XML result for the Wager Confirm.
    Password String Player password from table DGSDATA.PLAYER field password.
  */
  async WagerPost(params: object) {
    const requestUrl = this.proxy_url + '/WagerPost';
    return await this.helper.FetchProxy('POST', params, requestUrl);
  }
  /** end Process bets */

  async GetActiveLeagues(params: object) {
    const requestUrl = this.proxy_url + '/GetActiveLeagues';
    return await this.helper.FetchProxy('POST', params, requestUrl);
  }

  async GetAnonActiveLeagues(params: object) {
    const requestUrl = this.proxy_url + '/GetAnonActiveLeagues';
    return await this.helper.FetchProxy('POST', params, requestUrl);
  }

  async GetScheduleUTC(params: object) {
    const requestUrl = this.proxy_url + '/GetScheduleUTC';
    return await this.helper.FetchProxy('POST', params, requestUrl, 'league');
  }

  async GetTeasers(params: object) {
    const requestUrl = this.proxy_url + '/GetTeasers';
    return await this.helper.FetchProxy('POST', params, requestUrl);
  }

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
