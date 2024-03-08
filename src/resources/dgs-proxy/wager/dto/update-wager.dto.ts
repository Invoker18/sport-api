import { PartialType } from '@nestjs/mapped-types';
import { CreateWagerDto } from './create-wager.dto';

export class UpdateWagerDto extends PartialType(CreateWagerDto) {}
