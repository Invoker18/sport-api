import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FetchService } from 'src/helpers/fetch.service';
import { PlayerService as ApiPlayerService } from '../../api/player/player.service';

@Injectable()
export class PlayerService {
  private readonly name = 'ProxyPlayer.asmx';
  private readonly proxy_url: string;
  private readonly proxy2_url: string;
  constructor(
    private readonly config: ConfigService,
    private readonly helper: FetchService,
    private player: ApiPlayerService,
  ) {
    this.proxy_url = config.get('dgs').proxy_url + this.name;
    this.proxy2_url = config.get('dgs').proxy2_url + '/api/player';
  }

  async register(params: any) {
    let data = {
      prmPrefix: params.prefix,
      prmAgent: params.agent,
      prmIdCurrency: params.currency_id,
      prmLineStyle: params.line_style_id,
      prmIdSource: params.source_id,
      prmName: params.name,
      prmLastName: params.last_name,
      prmLastName2: params.last_name_2,
      prmTitle: params.title,
      prmAddress1: params.address_1,
      prmAddress2: params.address_2,
      prmCity: params.city,
      prmState: params.state,
      prmCountry: params.country,
      prmZipCode: params.zip_code,
      prmPhone: params.phone,
      prmFax: params.fax,
      prmEmail: params.email,
      prmPassword: params.password,
      prmIdLanguage: params.lang_id,
    };

    let response;

    switch (params.type) {
      case 1:
        data['prmDateofBirth'] = params.date_of_birth;
        data['prmIdTimeZone'] = params.time_zone_id;
        data['prmSignUpIp'] = params.ip;
        response = await this.GetPlayerSignUpWithDateofBirth(data);
      case 2:
        data['prmAccountName'] = params.account_name;
        response = await this.GetPlayerSignUpWithAccountName(data);
      default:
        response = await this.GetPlayerSignUp(data);
    }

    if (
      response.hasOwnProperty('data') &&
      response.hasOwnProperty('IdPlayer') &&
      /^\d+$/.test(response.data.IdPlayer)
    ) {
      await this.player.updatePlayerInfo({
        player_id: response.data.IdPlayer,
        password: params.password,
        new_password: params.password,
      });
    }

    return response;
  }

  async GetPlayerSignUp(params: object) {
    const requestUrl = this.proxy_url + '/GetPlayerSignUp';
    return await this.helper.FetchProxy('POST', params, requestUrl);
  }

  async GetPlayerSignUpWithDateofBirth(params: object) {
    const requestUrl = this.proxy_url + '/GetPlayerSignUpWithDateofBirth';
    return await this.helper.FetchProxy('POST', params, requestUrl);
  }

  async GetPlayerSignUpWithAccountName(params: object) {
    const requestUrl = this.proxy_url + '/GetPlayerSignUpWithAccountName';
    return await this.helper.FetchProxy('POST', params, requestUrl);
  }

  async GetPlayerOpenBets(params: object) {
    const requestUrl = this.proxy_url + '/GetPlayerOpenBets';
    return await this.helper.FetchProxy('POST', params, requestUrl);
  }

  async GetPlayerHistory(params: object) {
    const requestUrl = this.proxy_url + '/GetPlayerHistory';
    return await this.helper.FetchProxy('POST', params, requestUrl);
  }

  async GetFillOpenWager(params: any) {
    const requestUrl = `${this.proxy2_url}/GetPlayerFillOpenBets/${params.player_id}`;
    return await this.helper.FetchProxy('GET', params, requestUrl);
  }
}
