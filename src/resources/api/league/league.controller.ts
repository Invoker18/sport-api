import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LeagueService } from './league.service';

@Controller('league')
export class LeagueController {
  constructor(private readonly leagueService: LeagueService) {}

  @Get()
  findAll() {
    return this.leagueService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leagueService.findOne(+id);
  }

}
