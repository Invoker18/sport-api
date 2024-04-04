import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { Repository } from 'typeorm';
import { DATABASE_ENUM } from '../../../config/database/enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PlayerService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @InjectRepository(Player, DATABASE_ENUM.MSSQL_DGS)
    private playerRepository: Repository<Player>,
  ) {}

  /**

  */
  async login(params: any) {
    let user = params.user;
    let password = params.password;
    let book_id = params.book_id;
    let ip = params.ip;

    const player: any = Object.values(
      await this.getPlayerByUserName({ user }),
    )[0];

    if (!player) {
      throw new NotFoundException(`Invalid user ${user}. Not found`);
    } else if (player.OnlineAccess != 1 || player.IdBook != book_id) {
      throw new UnauthorizedException(
        `Player ${user} doesnt have Online Access. Contact Customer Services.`,
      );
    } else if (player.UserName != user || player.OnlinePassword != password) {
      throw new UnauthorizedException(`Invalid user name or password.`);
    }

    let call = await this.createCallInDGS({ player_id: player.IdPlayer, ip });
    let info = await this.getInfo({ player_id: player.IdPlayer });
    info[0].IdCall = call[0].IdCall;
    return info;
  }

  // exec GetPlayerForLogin @UserName='DWP-10'
  // go
  // declare @p6 int
  // set @p6=377544
  // exec CreateCall @IdPlayer=21595, @PhoneLine=-1, @IdUser=0, @IP='0.0.0.0', @System='I', @IdCall=@p6 output, @URL=''
  // select IdCall = @p6
  // go
  // exec WebGetPlayerOnline @IdPlayer=21595
  // go

  /**
    EXEC [CreateCall]
    @IdPlayer int,
    @PhoneLine smallint,
    @IdUser smallint,
    @IP varchar(100),
    @System char(1),
    @IdCall int OUTPUT,
    @URL varchar(50) = null
  */
  async createCallInDGS(params: any) {
    let cacheTimeSec = 1;
    let player_id = params.player_id;
    let ip = params.ip;

    // **CHECK CACHE
    const key = `get_createCallInDGS_${player_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.playerRepository.query(
      ` declare @p6 int;
        EXEC CreateCall ${player_id}, 1, 0, '${ip}', 'I', @p6 output, '';
        select IdCall = @p6
        `,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  /**
    EXEC [VZ_GetPlayerBalance]
    @prmIdPlayer int
  */
  async getPlayerByUserName(params: any) {
    let cacheTimeSec = 1;
    let user = params.user;

    // **CHECK CACHE
    const key = `get_playerByUserName_${user}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.playerRepository.query(
      `EXEC GetPlayerForLogin	'${user}'`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  /**
    EXEC [VZ_GetPlayerBalance]
    @prmIdPlayer int
  */
  async getBalance(params: any) {
    let cacheTimeSec = 2;
    let player_id = params.player_id;
    // **CHECK CACHE
    const key = `get_playerBalance_${player_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.playerRepository.query(
      `EXEC VZ_GetPlayerBalance	${player_id}`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }

  /**
    EXEC [VZ_GetPlayerInfo]
    @prmIdPlayer int
  */
  async getInfo(params: any) {
    let cacheTimeSec = 2;
    let player_id = params.player_id;
    // **CHECK CACHE
    const key = `get_playerInfo_${player_id}`;
    const cached = await this.cacheService.get(key);
    if (cached) return cached;
    // **CHECK CACHE

    const data = await this.playerRepository.query(
      `EXEC VZ_GetPlayerInfo ${player_id}`,
    );

    // **SET CACHE
    await this.cacheService.set(key, data, cacheTimeSec * 1000);
    // **SET CACHE

    return data;
  }
}
