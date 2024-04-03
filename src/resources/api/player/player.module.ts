import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { DATABASE_ENUM } from 'src/config/database/enum';

@Module({
  imports: [TypeOrmModule.forFeature([Player], DATABASE_ENUM.MSSQL_DGS)],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
