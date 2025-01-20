import { Transform } from 'class-transformer';
import { IsArray, IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { toNumber } from '../../../../helpers/cast.helper';

export class GetGamesByGameIdsQuery {
  @IsArray()
  @Transform(({ value }) => (!value ? [] : value.split(',')))
  @IsNotEmpty()
  @IsString({ each: true })
  game_ids: string[];

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  lang_id: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  player_id: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['E', 'D', 'F'])
  line_style: string;

  // @IsNotEmpty()
  // @IsString()
  // timezone: string;
}
