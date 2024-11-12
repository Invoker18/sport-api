import { Module } from '@nestjs/common';
import { DGSDataSource } from '../config/config-orm';
import { ProxyWagerModule } from './dgs-proxy/wager/wager.module';
import { ProxyPlayerModule } from './dgs-proxy/player/player.module';
import { PlayerModule } from './api/player/player.module';
import { LeagueModule } from './api/league/league.module';
import { GameModule } from './api/game/game.module';
import { LanguageModule } from './api/language/language.module';
import { TimezoneModule } from './api/timezone/timezone.module';

@Module({
  imports: [
    DGSDataSource,
    ProxyWagerModule,
    ProxyPlayerModule,
    PlayerModule,
    LeagueModule,
    GameModule,
    LanguageModule,
    TimezoneModule,
  ],
})
export class ResourcesModule {}
