import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

  async WagerCompile() {}

  async WagerCompile2() {}

  async WagerConfirm() {}

  async WagerPost() {}

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
