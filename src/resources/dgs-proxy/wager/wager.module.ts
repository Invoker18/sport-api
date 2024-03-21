import { Module } from '@nestjs/common';
import { WagerService } from './wager.service';
import { WagerController } from './wager.controller';

@Module({
  imports: [],
  controllers: [WagerController],
  providers: [WagerService],
})
export class ProxyWagerModule {}
