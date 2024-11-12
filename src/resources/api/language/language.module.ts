import { Module } from '@nestjs/common';
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { DATABASE_ENUM } from 'src/config/database/enum';

@Module({
  imports: [TypeOrmModule.forFeature([Language], DATABASE_ENUM.MSSQL_DGS)],
  controllers: [LanguageController],
  providers: [LanguageService],
  exports: [LanguageService],
})
export class LanguageModule {}
