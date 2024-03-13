import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateWagerDto } from './dto/create-wager.dto';
import { UpdateWagerDto } from './dto/update-wager.dto';
import { XMLParser } from 'fast-xml-parser';

@Injectable()
export class WagerService {

  constructor() {}

  async GetActiveLeagues(/*createWagerDto: CreateWagerDto*/) {
    // const requestUrl = 'http://192.168.5.178:86/ProxyWager.asmx/GetActiveLeagues';
    // const formData = new URLSearchParams(
    //   {    IdBook: "1",  }
    // ); 
    // const requestConfig = {        
    //   method: "POST",        
    //   body: formData,        
    //   headers: new Headers(
    //     {          
    //       "content-type": "application/x-www-form-urlencoded",        
    //     }
    //   ),      
    // };

    // try {    
    //   const response = await fetch( 
    //     requestUrl,  
    //     requestConfig    
    //   );    
    //   const data = await response.text();    
    //   const optionsParser = {    
    //     ignoreAttributes: false,    
    //     attributeNamePrefix: "",    
    //     attributesGroupName: "",  
    //   }
    //   const parser = new XMLParser(optionsParser);
    //   let xmlParsed = parser.parse(data);    
    //   xmlParsed = parser.parse(xmlParsed.string["#text"])['xml']??'';    
    //   return xmlParsed;  
    // } 
    // catch (error) {    
    //   throw new ForbiddenException('API not available:' + error);
    // }
  }

  async GetAnonActiveLeagues(book_id) {
    const requestUrl = 'http://192.168.5.178:86/ProxyWager.asmx/GetAnonActiveLeagues';
    const formData = new URLSearchParams(
      {    IdBook: book_id,  }
    ); 
    const requestConfig = {        
      method: "POST",        
      body: formData,        
      headers: new Headers(
        {          
          "content-type": "application/x-www-form-urlencoded",        
        }
      ),      
    };

    try {    
      const response = await fetch( 
        requestUrl,  
        requestConfig    
      );    
      const data = await response.text();    
      const optionsParser = {    
        ignoreAttributes: false,    
        attributeNamePrefix: "",    
        attributesGroupName: "",  
      }
      const parser = new XMLParser(optionsParser);
      let xmlParsed = parser.parse(data);    
      xmlParsed = parser.parse(xmlParsed.string["#text"])['xml']??'';    
      return xmlParsed;  
    } 
    catch (error) {    
      throw new ForbiddenException('API not available:' + error);
    }

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
