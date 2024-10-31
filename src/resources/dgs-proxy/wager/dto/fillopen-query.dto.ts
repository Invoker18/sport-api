import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { toNumber } from '../../../../helpers/cast.helper';

export class FillOpenQuery {
  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  player_id: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  fill_wager_id: number;
}
