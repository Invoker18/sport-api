import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATABASE_ENUM } from 'src/config/database/enum';
import { Odds } from './entities/odds.entity';
import { OddsController } from './odds.controller';
import { OddsService } from './odds.service';

@Module({
  imports: [TypeOrmModule.forFeature([Odds], DATABASE_ENUM.MSSQL_DGS)],
  controllers: [OddsController],
  providers: [OddsService],
})
export class OddsModule {}
