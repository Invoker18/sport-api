import { Module } from '@nestjs/common';
import { LeagueController } from './league.controller';
import { LeagueService } from './league.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { League } from './entities/league.entity';
import { DATABASE_ENUM } from 'src/config/database/enum';

@Module({
  imports: [TypeOrmModule.forFeature([League], DATABASE_ENUM.MSSQL_DGS)],
  controllers: [LeagueController],
  providers: [LeagueService],
})
export class LeagueModule {}
