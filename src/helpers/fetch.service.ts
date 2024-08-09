import { ForbiddenException, Injectable } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';
import { string } from 'joi';

@Injectable()
export class FetchService {
  constructor() {}

  async FetchProxy(
    method: any,
    params: any,
    requestUrl: any,
    $key = 'index',
    returnXML = false,
  ) {
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
      const optionsParser = {
        ignoreAttributes: false,
        attributeNamePrefix: '',
        attributesGroupName: '',
      };

      const parser = new XMLParser(optionsParser);
      let xmlParsed = parser.parse(data);
      console.log(data);
      const xmlParsedText = xmlParsed.string['#text'];
      xmlParsed = parser.parse(xmlParsedText)['xml'] ?? '';
      const returnData = returnXML
        ? xmlParsedText
        : xmlParsed[$key] ?? xmlParsed;
      return xmlParsed['ErrorCode'] == 0
        ? returnData
        : {
            status: 'error',
            error: 'Proxy',
            code: xmlParsed['ErrorCode'],
            message_key: xmlParsed['ErrorMsgKey'],
            message_param: xmlParsed['ErrorMsgParams'],
            message: xmlParsed['ErrorMsg'],
          };
    } catch (error) {
      throw new ForbiddenException('API not available: ' + error);
    }
  }
}
