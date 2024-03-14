import { ForbiddenException, Injectable } from '@nestjs/common';
import { GlobalService } from '../../../common/global.service';

@Injectable()
export class WagerService {

  constructor(private readonly helper: GlobalService) {}

  async GetActiveLeagues(params: object) {
    const requestUrl = process.env.DGS_PROXY_URL + 'ProxyWager.asmx/GetAnonActiveLeagues';
    return this.helper.FetchProxy("POST", params , requestUrl)
  }

  async GetAnonActiveLeagues(params: object) {
    const requestUrl = process.env.DGS_PROXY_URL + 'ProxyWager.asmx/GetAnonActiveLeagues';
    return this.helper.FetchProxy("POST",  params, requestUrl)
  }

  async GetScheduleUTC() {
  }

  async GetTeasers() {
  }

  async GetVersion() {
  }

  async RBLGradeBet() {
  }

  async RBLInsertBet() {
  }

  async RBLUnGradeBet() {
  }

  async FillCompile() {
  }

  async WagerCompile() {
  }

  async WagerCompile2() {
  }

  async WagerConfirm() {
  }

  async WagerPost() {
  }

  async GetFillOpenWager() {
  }

  async GetScheduleForGames() {
  }

  async GetSchedule() {
  }

  async GetFamilygames() {
  }

  async GetNewScheduleUTC() {
  }

  async GetNewSchedule() {
  }

  async GetParlays() {
  }

  async GetUpcomingGames() {
  }

  async WagerRemove() {
  }

  async WagerUpdateLines() {
  }

  async WagerValidate() {
  }
  
}
