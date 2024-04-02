import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiNotAcceptableResponse, ApiNotFoundResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { query } from 'express';
import { ApiKeyAuth } from 'src/decorator/auth.decorator';
import { FindByBookQuery } from './dto/get-league.dto';
import { LeagueService } from './league.service';

@Controller('league')
@ApiKeyAuth()
@ApiTags('proxyWager')
export class LeagueController {
  constructor(private readonly leagueService: LeagueService) {}

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
  @Get()
  getLeagues(@Query() params: FindByBookQuery) {
    return this.leagueService.find(params);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.leagueService.findOne(+id);
  // }
}
