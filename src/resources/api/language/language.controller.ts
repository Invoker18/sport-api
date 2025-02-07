import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LanguageService } from './language.service';

@Controller('language')
@ApiTags('API Language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get('all')
  async getLanguages(): Promise<string> {
    return await this.languageService.getLanguages();
  }
}
