import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { toNumber } from '../../../../helpers/cast.helper';

export class GetFamilyGamesQuery {
  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  family_game_id: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  lang_id: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  player_id: number;
}
