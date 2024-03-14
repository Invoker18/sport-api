import { Module } from '@nestjs/common'

import { ProxyWagerModule } from './dgs-proxy/wager/wager.module';
import { ProxyPlayerModule } from './dgs-proxy/player/player.module';
import { LeagueModule } from './api/league/league.module';
import { GameModule } from './api/game/game.module';
import { SportModule } from './api/sport/sport.module';

@Module({
  imports: [
    ProxyWagerModule, 
    ProxyPlayerModule, 
    LeagueModule,
    GameModule,
    SportModule,
  ],
})
export class ResourcesModule {}