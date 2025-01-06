import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { PlayerModule as ApiPlayerModule } from 'src/resources/api/player/player.module';

@Module({
  imports: [ApiPlayerModule],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class ProxyPlayerModule {}
