import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { DATABASE_ENUM } from 'src/config/database/enum';
import { PlayerModule } from '../player/player.module';
import { LeagueModule } from '../league/league.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game], DATABASE_ENUM.MSSQL_DGS),
    PlayerModule,
    LeagueModule,
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
