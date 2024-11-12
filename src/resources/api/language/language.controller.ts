import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeyAuth } from '../../../decorator/auth.decorator';
import { LanguageService } from './language.service';

@Controller('language')
@ApiKeyAuth()
@ApiTags('API Language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get('all')
  async getLanguages(): Promise<string> {
    return await this.languageService.getLanguages();
  }
}
