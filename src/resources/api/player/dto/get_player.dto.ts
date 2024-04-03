import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { toNumber } from '../../../../helpers/cast.helper';

export class IdPlayerParam {
  @Transform(({ value }) => toNumber(value, { min: 1 }))
  @IsNotEmpty()
  @IsNumber()
  player_id: number;
}
