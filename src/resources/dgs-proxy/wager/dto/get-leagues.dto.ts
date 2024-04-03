import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { toNumber } from '../../../../helpers/cast.helper';

export class GetActiveLeaguesQuery {
  @Transform(({ value }) => toNumber(value, { min: 0, max: 1 }))
  @IsNotEmpty()
  @IsNumber()
  active: number;

  @Transform(({ value }) => toNumber(value, { min: 1 }))
  @IsNotEmpty()
  @IsNumber()
  book_id: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNumber()
  profile_id?: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNumber()
  line_type_id?: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNumber()
  wager_type_id?: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNumber()
  lang_id?: number;
}

