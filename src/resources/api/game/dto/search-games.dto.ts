import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { toNumber, trim } from '../../../../helpers/cast.helper';

export class searchGamesQuery {
  @Transform(({ value }) => trim(value))
  @IsNotEmpty()
  @IsString()
  search: string;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  player_id: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  lang_id: number;
}
