import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiNotAcceptableResponse, ApiNotFoundResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { query } from 'express';
import { ApiKeyAuth } from 'src/decorator/auth.decorator';
import { GetActiveLeaguesQuery } from './dto/get-league.dto';
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
  @ApiQuery({
    name: 'book_id',
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
  @Get()
  async getActiveLeagues(
    @Query() params: GetActiveLeaguesQuery,
  ): Promise<string> {
    return await this.leagueService.getActiveLeagues(params);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.leagueService.findOne(+id);
  // }
}
