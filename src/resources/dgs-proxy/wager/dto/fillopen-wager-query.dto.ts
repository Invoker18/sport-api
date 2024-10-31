import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { toNumber } from '../../../../helpers/cast.helper';

export class FillOpenWagerQuery {
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
  fill_wager_id: number;

  @IsNotEmpty()
  @IsOptional()
  extra_details: string;

  @IsOptional()
  teaser_points: string;

  @IsNotEmpty()
  process_type: string;

  @IsOptional()
  password?: string;
}
