import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { toNumber } from '../../../../helpers/cast.helper';

export class GetHistoryQuery {
  @Transform(({ value }) => toNumber(value, { min: 1 }))
  @IsNotEmpty()
  @IsNumber()
  prmIdPlayer: number;

  @Transform(({ value }) => toNumber(value, { min: 0, max: 2 }))
  @IsNotEmpty()
  @IsNumber()
  Mode: number;
}
