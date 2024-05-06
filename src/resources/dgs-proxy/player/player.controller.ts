import { Controller, Get } from '@nestjs/common';
import { PlayerService } from './player.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('proxy/player')
@ApiTags('proxyPlayer')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get()
  findAll() {
    return '';
  }
}
