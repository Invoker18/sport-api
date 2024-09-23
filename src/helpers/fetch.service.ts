import { ForbiddenException, Injectable } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';
import { string } from 'joi';
import { XMLToJson } from './cast.helper';

@Injectable()
export class FetchService {
  constructor() {}

  async FetchProxy(method: any, params: any, requestUrl: any, $key = 'index') {
    try {
      const formData = new URLSearchParams(params);
      const requestConfig = {
        method: method,
        body: formData,
        headers: new Headers({
          'content-type': 'application/x-www-form-urlencoded',
        }),
      };
      const response = await fetch(requestUrl, requestConfig);
      const data = await response.text();
      const xmlParsed = XMLToJson(data);
      console.log(xmlParsed);
      return xmlParsed['ErrorCode'] == 0
        ? xmlParsed[$key] ?? xmlParsed
        : {
            status: 'error',
            error: 'Proxy',
            code: xmlParsed['ErrorCode'],
            message_key: xmlParsed['ErrorMsgKey'],
            message_param: xmlParsed['ErrorMsgParams'],
            message: xmlParsed['ErrorMsg'],
            data_fetch: xmlParsed,
          };
    } catch (error) {
      throw new ForbiddenException('API not available: ' + error);
    }
  }
}
