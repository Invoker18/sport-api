import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeyAuth } from '../../../decorator/auth.decorator';
import { OddsService } from './odds.service';

@Controller('odds')
@ApiKeyAuth()
@ApiTags('API Odds')
export class OddsController {
  constructor(private readonly oddsService: OddsService) {}

  @Get('/dgs-conversion')
  async getOddsConversionDGS(): Promise<string> {
    return await this.oddsService.getOddsConversionDGS();
  }
}
