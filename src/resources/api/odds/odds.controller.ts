import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OddsService } from './odds.service';

@Controller('odds')
@ApiTags('API Odds')
export class OddsController {
  constructor(private readonly oddsService: OddsService) {}

  @Get('/conversions')
  async getOddsConversionDGS(): Promise<string> {
    return await this.oddsService.getOddsConversionDGS();
  }
}
