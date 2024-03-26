import { ForbiddenException, Injectable } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';

@Injectable()
export class FetchService {
  constructor() {}

  async FetchProxy(method, params, requestUrl) {
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
      xmlParsed = parser.parse(xmlParsed.string['#text'])['xml'] ?? '';
      if (xmlParsed['ErrorCode'] == 0) {
        return xmlParsed['index'];
      }else{
        throw new ForbiddenException(xmlParsed['ErrorMsg']);
      }
    } catch (error) {
      throw new ForbiddenException('API not available: ' + error);
    }
  }
}
