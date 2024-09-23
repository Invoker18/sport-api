import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsBooleanString,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { toNumber } from '../../../../helpers/cast.helper';

export class WagerQuery {
  @IsNotEmpty()
  details: string;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  player_id: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  call_id: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  wager_type: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  open_spots: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  wager_type_id: number;

  @IsNotEmpty()
  fix_teaser_line: boolean;

  @IsNotEmpty()
  @IsOptional()
  extra_details: string;

  // @Transform(({ value }) => toNumber(value, { min: 0 }))
  // @IsNotEmpty()
  // @IsOptional()
  // @IsNumber()
  // riskwin: number;
  @Transform(({ value }) => JSON.parse(value))
  @IsOptional()
  amount: string[];

  @IsOptional()
  round_robin: string;

  @IsNotEmpty()
  process_type: string;

  @IsOptional()
  password?: string;
}
