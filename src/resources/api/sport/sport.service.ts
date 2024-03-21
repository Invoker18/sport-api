import { Injectable } from '@nestjs/common';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';

@Injectable()
export class SportService {
  findAll() {
    return `This action returns all sport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sport`;
  }
}
