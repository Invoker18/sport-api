import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsIP,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { toNumber } from '../../../../helpers/cast.helper';

export class GetRegisterQuery {
  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  type: number;

  @IsString()
  prefix: string;

  @IsNotEmpty()
  @IsString()
  agent: string;

  @Transform(({ value }) => toNumber(value, { min: 1 }))
  @IsNotEmpty()
  @IsNumber()
  currency_id: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['E', 'D', 'F'])
  line_style_id: string;

  @Transform(({ value }) => toNumber(value, { min: 1 }))
  @IsNotEmpty()
  @IsNumber()
  source_id: number;

  @IsOptional()
  @IsString()
  name?: string = '';

  @IsOptional()
  @IsString()
  last_name?: string = '';

  @IsOptional()
  @IsString()
  last_name_2?: string = '';

  @IsOptional()
  @IsString()
  title?: string = '';

  @IsOptional()
  @IsString()
  address_1?: string = '';

  @IsOptional()
  @IsString()
  address_2?: string = '';

  @IsOptional()
  @IsString()
  city?: string = '';

  @IsOptional()
  @IsString()
  state?: string = '';

  @IsOptional()
  @IsString()
  country?: string = '';

  @IsOptional()
  @IsString()
  zip_code?: string = '';

  @IsOptional()
  @IsString()
  phone?: string = '';

  @IsOptional()
  @IsString()
  fax?: string = '';

  @IsOptional()
  @IsEmail()
  email?: string = '';

  @IsNotEmpty()
  @IsString()
  password: string = '';

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsNotEmpty()
  @IsNumber()
  lang_id: number;

  @IsOptional()
  @IsString()
  date_of_birth?: string = '';

  @Transform(({ value }) => toNumber(value, { min: 0 }))
  @IsOptional()
  @IsNumber()
  time_zone_id?: number;

  @IsOptional()
  @IsIP()
  ip?: string = '0.0.0.0';

  @IsOptional()
  @IsString()
  account_name?: string = '';
}
