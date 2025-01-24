//Module
import { Global, Module } from '@nestjs/common';
import { FetchService } from './fetch.service';
import { BcryptService } from './bcrypt.service';
import { DataService } from './data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATABASE_ENUM } from 'src/config/database/enum';
import { Odds } from 'src/resources/api/odds/entities/odds.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Odds], DATABASE_ENUM.MSSQL_DGS)],
  exports: [FetchService, BcryptService, DataService],
  providers: [FetchService, BcryptService, DataService],
})
export class SharedModule {}
