import { Controller, Get, Header, Post, Body, Patch, Param, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { WagerService } from './wager.service';
import { CreateWagerDto } from './dto/create-wager.dto';
import { UpdateWagerDto } from './dto/update-wager.dto';
import {
  ApiBasicAuth,
  ApiInternalServerErrorResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
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

  @Get("leagues")
  @Header('Content-Type', 'application/json')
  @ApiResponse({
    status: 200,
    description: 'Lista de leagues',
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
  async GetLeagues() {
    // let response = this.wagerService.GetActiveLeagues(/*createWagerDto*/);
    let response = await this.wagerService.GetAnonActiveLeagues(/*createWagerDto*/);
    return {
      "status": "success",
      "data": response,
      "message": null /* Or optional success message */
    }
  }

}
