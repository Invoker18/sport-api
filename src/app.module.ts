import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WagerModule } from './resources/dgs-proxy/wager/wager.module';
import { PlayerModule } from './resources/dgs-proxy/player/player.module';
import { DatabaseModule } from './config/database/database.module';


@Module({
  imports: [
    DatabaseModule,
    WagerModule, 
    PlayerModule, 
    ConfigModule.forRoot({
      envFilePath: ['.prod.env', '.test.env', '.env'],
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
