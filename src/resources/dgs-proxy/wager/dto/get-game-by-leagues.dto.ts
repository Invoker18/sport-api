import { Transform } from 'class-transformer';
import { IsAlphanumeric, IsNotEmpty, IsNumber, IsNumberString, IsOptional } from 'class-validator';
import { toNumber } from '../../../../helpers/cast.helper';

export class GetGamesByLeaguesQuery {
  @Transform(({ value }) => toNumber(value, { min: 1 }))
  @IsNotEmpty()
  @IsNumber()
  book_id: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  profile_id: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  profile_limits_id: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  line_type_id: number;

  @IsNotEmpty()
  nhl_line: string;

  @IsNotEmpty()
  mlb_line: string;

  @IsNotEmpty()
  line_style: string;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  wager_type: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  wager_type_id: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  str_id_leagues: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  lang_id: number;

  @IsNotEmpty()
  utc: string;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  agent_id: number;
}

