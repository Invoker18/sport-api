import { Controller, Get, Header, Post, Body, Patch, Param, Delete, Query, HttpCode, UseGuards } from '@nestjs/common';
import { WagerService } from './wager.service';
// import { BookIdValidatorPipe } from './pipes/book-id-validator.pipe'
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiInternalServerErrorResponse,
  ApiNotAcceptableResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { BasicAuth } from '../../../decorator/auth.decorator'

@Controller('proxy/wager')
@BasicAuth()
@ApiTags('proxyWager')
export class WagerController {
  constructor(private readonly wagerService: WagerService) {}

  @Get("leagues")
  @Header('Content-Type', 'application/json')
  @ApiResponse({
    status: 200,
    description: 'Lista de leagues',
  })
  @ApiQuery({
    name: 'active',
    required: true,
  })
  @ApiQuery({
    name: 'book_id',
    required: true,
  })
  @ApiQuery({
    name: 'profile_id',
    required: false,
  })
  @ApiQuery({
    name: 'line_type_id',
    required: false,
  })
  @ApiQuery({
    name: 'wager_type',
    required: false,
  })
  @ApiQuery({
    name: 'lang',
    required: false,
  })
  @ApiNotFoundResponse({
    description: 'No encontrada',
  })
  @ApiNotAcceptableResponse({
    description: 'Parametros no es válido',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno de la api',
  })
  async GetLeagues(
    @Query('active') active: number,
    @Query('book_id') IdBook: number,
    @Query('profile_id') IdProfile?: number,
    @Query('line_type_id') IdLineType?: number,
    @Query('wager_type') WagerType?: number,
    @Query('lang') Language?: number,
  ) 
  {
    let response
    if (active == 1) {
      response = this.wagerService.GetActiveLeagues({IdBook,IdProfile,IdLineType,WagerType,Language});
    }else{
      response = await this.wagerService.GetAnonActiveLeagues({IdBook});
    }
    return {
      "status": "success",
      "data": response,
      "message": null /* Or optional success message */
    }
  }
  
}
