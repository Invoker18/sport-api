import { Transform } from 'class-transformer';
import { IsIP, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { toNumber, trim } from '../../../../helpers/cast.helper';

export class LoginParams {
  @Transform(({ value }) => trim(value))
  @IsNotEmpty()
  @IsString()
  user: string;

  @Transform(({ value }) => trim(value))
  @IsNotEmpty()
  @IsString()
  password: string;

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  book_id: number;

  @Transform(({ value }) => trim(value))
  @IsNotEmpty()
  @IsIP()
  ip: string;
}
