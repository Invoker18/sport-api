import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
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
  @IsIn(['E', 'D', 'F'])
  line_style: string;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  wager_type: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  wager_type_id: number;

  @IsNotEmpty()
  @IsString()
  str_id_leagues: string;

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
