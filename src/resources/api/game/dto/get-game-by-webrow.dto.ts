import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { toNumber } from '../../../../helpers/cast.helper';

export class GetGamesByWebRowQuery {
  @IsArray()
  @Transform(({ value }) => value.split(','))
  @IsNotEmpty()
  @IsString({ each: true })
  webrow_id: string[];

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  lang_id: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  player_id: number;

  @IsDate()
  start_date: Date;

  @IsDate()
  end_date: Date;

  @Transform(({ value }) => toNumber(value, { min: -1 }))
  @IsOptional()
  @IsNumber()
  period?: number = -1;
}
