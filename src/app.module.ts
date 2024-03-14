import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxyWagerModule } from './resources/dgs-proxy/wager/wager.module';
import { ProxyPlayerModule } from './resources/dgs-proxy/player/player.module';
import { DatabaseModule } from './config/database/database.module';
import { LeagueModule } from './resources/api/league/league.module';
import { GameModule } from './resources/api/game/game.module';
import { SportModule } from './resources/api/sport/sport.module';
import { AuthModule } from './auth/auth.module';
import { GlobalModule } from "./common/global.module";

@Module({
  imports: [
    // Cargamos los ficheros de .env
    ConfigModule.forRoot({
      envFilePath: ['.prod.env', '.test.env', '.env'],
    }), 
    GlobalModule,
    DatabaseModule,
    AuthModule,
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
