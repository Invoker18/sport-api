import { Module } from '@nestjs/common';
import { DGSDataSource } from '../config/config-orm';
import { ProxyWagerModule } from './dgs-proxy/wager/wager.module';
// import { ProxyPlayerModule } from './dgs-proxy/player/player.module';
import { LeagueModule } from './api/league/league.module';
import { GameModule } from './api/game/game.module';

@Module({
  imports: [
    DGSDataSource,
    ProxyWagerModule,
    // ProxyPlayerModule,
    // PlayerModule,
    LeagueModule,
    GameModule,
  ],
})
export class ResourcesModule {}
