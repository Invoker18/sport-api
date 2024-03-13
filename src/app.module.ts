import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxyWagerModule } from './resources/dgs-proxy/wager/wager.module';
import { ProxyPlayerModule } from './resources/dgs-proxy/player/player.module';
import { DatabaseModule } from './config/database/database.module';
import { LeagueModule } from './resources/api/league/league.module';
import { GameModule } from './resources/api/game/game.module';
import { SportModule } from './resources/api/sport/sport.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.prod.env', '.test.env', '.env'],
    }), 
    DatabaseModule,
    ProxyWagerModule, 
    ProxyPlayerModule, 
    LeagueModule, 
    GameModule, 
    SportModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
