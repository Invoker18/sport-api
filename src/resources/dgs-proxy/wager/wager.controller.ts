import { Controller, Get, Header, Post, Body, Patch, Param, Delete, Query, HttpCode, UseGuards } from '@nestjs/common';
import { WagerService } from './wager.service';
import { CreateWagerDto } from './dto/create-wager.dto';
import { UpdateWagerDto } from './dto/update-wager.dto';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiInternalServerErrorResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
// import { AuthGuard } from '@nestjs/passport'

@Controller('proxy/wager')
// @UseGuards(AuthGuard('basic')) // Usamos el guard de Basic Auth en este controlador y todos los métodos
@ApiTags('proxyWager')
// @ApiBasicAuth() // Añadimos el Basic Auth en la documentación de Swagger
export class WagerController {
  constructor(private readonly wagerService: WagerService) {}

  @Get("leagues/:token")
  @Header('Content-Type', 'application/json')
  @ApiResponse({
    status: 200,
    description: 'Lista de leagues',
  })
  @ApiParam({
    name: 'token',
    required: true,
  })
  @ApiQuery({
    name: 'active',
    required: true,
  })
  @ApiQuery({
    name: 'book_id',
    required: true,
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
    @Param('token') token: string,
    @Query('active') active: number,
    @Query('book_id') book_id: number,
  ) 
  {
    let response
    if (active == 1) {
      response = this.wagerService.GetActiveLeagues(/*createWagerDto*/);
    }else{
      response = await this.wagerService.GetAnonActiveLeagues(book_id);
    }
    return {
      "status": "success",
      "data": response,
      "message": null /* Or optional success message */
    }
  }
  
}
