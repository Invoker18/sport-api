import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DateRangeParam {
  @ApiProperty()
  @IsNotEmpty()
  from_date: string;

  @ApiProperty()
  @IsNotEmpty()
  to_date: string;
}
