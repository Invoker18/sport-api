import { Module } from '@nestjs/common';
import { WagerService } from './wager.service';
import { WagerController } from './wager.controller';
import { PlayerModule } from 'src/resources/api/player/player.module';

@Module({
  imports: [PlayerModule],
  controllers: [WagerController],
  providers: [WagerService],
})
export class ProxyWagerModule {}
