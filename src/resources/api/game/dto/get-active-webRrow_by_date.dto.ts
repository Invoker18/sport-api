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

export class GetActiveWebRowByDateQuery {
  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  lang_id: number;

  @Transform(({ value }) => toNumber(value, { min: 1 }))
  @IsNotEmpty()
  @IsNumber()
  book_id: number;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  line_type_id: number;

  @IsDate()
  start_date: Date;

  @IsDate()
  end_date: Date;

  @IsArray()
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsString({ each: true })
  league_ids?: string[] = ['-1'];
}
