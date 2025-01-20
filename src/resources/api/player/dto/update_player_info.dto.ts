import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { toNumber, trim } from '../../../../helpers/cast.helper';

export class UpdatePlayerInfo {
  @Transform(({ value }) => toNumber(value, { min: 1 }))
  @IsNotEmpty()
  @IsNumber()
  player_id: number;

  @Transform(({ value }) => trim(value))
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  new_password: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  last_name2: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  address1: string;

  @IsOptional()
  @IsString()
  address2: string;

  @IsOptional()
  city: string;

  @IsOptional()
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  zip: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  fax: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  culture_info: string;

  @IsOptional()
  @IsString()
  @IsIn(['E', 'D', 'F'])
  line_style: string;

  @IsOptional()
  @IsNumber()
  timezone_id: number = -1;

  @IsOptional()
  @IsNumber()
  language_id: number = -1;
}
