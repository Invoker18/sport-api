import { Module } from '@nestjs/common';
import { TimezoneController } from './timezone.controller';
import { TimezoneService } from './timezone.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timezone } from './entities/timezone.entity';
import { DATABASE_ENUM } from 'src/config/database/enum';

@Module({
  imports: [TypeOrmModule.forFeature([Timezone], DATABASE_ENUM.MSSQL_DGS)],
  controllers: [TimezoneController],
  providers: [TimezoneService],
  exports: [TimezoneService],
})
export class TimezoneModule {}
