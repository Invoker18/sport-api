import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { DATABASE_ENUM } from 'src/config/database/enum';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game], DATABASE_ENUM.MSSQL_DGS),
    PlayerModule,
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
