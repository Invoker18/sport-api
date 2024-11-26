//Module
import { Global, Module } from '@nestjs/common';
import { FetchService } from './fetch.service';
import { BcryptService } from './bcrypt.service';
import { DataService } from './data.service';
import { OddsConvertionService } from './odds-convertion.service';
import { OddsService } from 'src/resources/api/odds/odds.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATABASE_ENUM } from 'src/config/database/enum';
import { Odds } from 'src/resources/api/odds/entities/odds.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Odds], DATABASE_ENUM.MSSQL_DGS)],
  exports: [FetchService, BcryptService, DataService, OddsConvertionService],
  providers: [
    FetchService,
    BcryptService,
    DataService,
    OddsConvertionService,
    OddsService,
  ],
})
export class SharedModule {}
