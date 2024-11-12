import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeyAuth } from '../../../decorator/auth.decorator';
import { TimezoneService } from './timezone.service';

@Controller('timezone')
@ApiKeyAuth()
@ApiTags('API Timezone')
export class TimezoneController {
  constructor(private readonly timezoneService: TimezoneService) {}

  @Get('all')
  async getTimeZones(): Promise<string> {
    return await this.timezoneService.getTimeZones();
  }
}
