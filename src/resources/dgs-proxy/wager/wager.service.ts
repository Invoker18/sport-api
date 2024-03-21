import { Injectable } from '@nestjs/common';
import { FetchService } from '../../../helpers/fetch.service';

@Injectable()
export class WagerService {
  private readonly name = 'ProxyWager.asmx';
  constructor(private readonly helper: FetchService) {}

  async GetActiveLeagues(params: object) {
    const requestUrl =
      process.env.DGS_PROXY_URL + this.name + '/GetActiveLeagues';
    return this.helper.FetchProxy('POST', params, requestUrl);
  }

  async GetAnonActiveLeagues(params: object) {
    const requestUrl =
      process.env.DGS_PROXY_URL + this.name + '/GetAnonActiveLeagues';
    return this.helper.FetchProxy('POST', params, requestUrl);
  }

  async GetScheduleUTC() {}

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
