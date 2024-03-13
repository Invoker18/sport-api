import { Injectable } from '@nestjs/common';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';

@Injectable()
export class LeagueService {

  findAll() {
    return `This action returns all league`;
  }

  findOne(id: number) {
    return `This action returns a #${id} league`;
  }


}
