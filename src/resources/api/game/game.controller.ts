import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../../../interceptor/transform.interceptor';
import { ApiKeyAuth } from '../../../decorator/auth.decorator';
import { GameService } from './game.service';

@Controller('game')
@ApiKeyAuth()
@ApiTags('API Game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('/league/:league_id')
  @UseInterceptors(TransformInterceptor)
  async getGamesByLeague(): Promise<string> {
    return await this.gameService.getGamesByLeagues();
  }
}

// exec WebGetSystemPreferences
// go
// exec WebGetProfileData @prmIdProfile=1
// go
// exec WebGetOddsDefault @prmIdProfile=1
// go
// exec WebGetParlayBasicSports @prmIdProfile=1
// go
// exec WebGetBookClientPreferencesData @prmIdBook=1
// go
// exec WebGetLanguageData @prmIdLanguage=1
// go
// exec WebGetLeagueLang @prmIdLanguage=1
// go
// exec WebGetLeagueRegionlang @prmIdLanguage=1
// go
// exec WebGetLeagueDescription @prmIdLeague=112
// go
// exec WebGetOpenGamesLeague @IdLeague=112,@IdLineType=1,@IdLanguage=1,@IdGame=-1,@IdAgent=1659,@WagerType=0
// go
// exec WebGetLanguageCultureInfo
// go
// exec WebGetLeagueBanners @IdLeague=112,@IdLanguage=1
// go
// exec WebGetProfileLimitsData @prmIdProfileLimits=1,@prmIdSport='SOC  ',@prmIdGameType=1
// go
// exec JuiceRebate_GetList @prmIdLineType=1,@prmIdGameType=1,@prmIdSport='SOC',@prmLine=1,@prmOnline=1,@prmIdUser=0
// go
// exec JuiceRebate_GetList @prmIdLineType=1,@prmIdGameType=1,@prmIdSport='SOC',@prmLine=2,@prmOnline=1,@prmIdUser=0
// go
// exec JuiceRebate_GetList @prmIdLineType=1,@prmIdGameType=1,@prmIdSport='SOC',@prmLine=3,@prmOnline=1,@prmIdUser=0
// go
// exec JuiceRebate_GetList @prmIdLineType=1,@prmIdGameType=1,@prmIdSport='SOC',@prmLine=4,@prmOnline=1,@prmIdUser=0
// go
// exec WebGetEventTypeData @prmIdEvent=0
// go
// exec WebGetProfileGameTypeData @prmIdProfile=1,@prmIdGameType=1
// go
// exec WebGetProfileLimitsData @prmIdProfileLimits=1,@prmIdSport='SOC  ',@prmIdGameType=12
// go
// exec JuiceRebate_GetList @prmIdLineType=1,@prmIdGameType=12,@prmIdSport='SOC',@prmLine=1,@prmOnline=1,@prmIdUser=0
// go
// exec JuiceRebate_GetList @prmIdLineType=1,@prmIdGameType=12,@prmIdSport='SOC',@prmLine=2,@prmOnline=1,@prmIdUser=0
// go
// exec JuiceRebate_GetList @prmIdLineType=1,@prmIdGameType=12,@prmIdSport='SOC',@prmLine=3,@prmOnline=1,@prmIdUser=0
// go
// exec JuiceRebate_GetList @prmIdLineType=1,@prmIdGameType=12,@prmIdSport='SOC',@prmLine=4,@prmOnline=1,@prmIdUser=0
// go
// exec WebGetProfileGameTypeData @prmIdProfile=1,@prmIdGameType=12
// go
// exec WebGetProfileLimitsData @prmIdProfileLimits=1,@prmIdSport='SOC  ',@prmIdGameType=13
// go
// exec JuiceRebate_GetList @prmIdLineType=1,@prmIdGameType=13,@prmIdSport='SOC',@prmLine=1,@prmOnline=1,@prmIdUser=0
// go
// exec JuiceRebate_GetList @prmIdLineType=1,@prmIdGameType=13,@prmIdSport='SOC',@prmLine=2,@prmOnline=1,@prmIdUser=0
// go
// exec JuiceRebate_GetList @prmIdLineType=1,@prmIdGameType=13,@prmIdSport='SOC',@prmLine=3,@prmOnline=1,@prmIdUser=0
// go
// exec JuiceRebate_GetList @prmIdLineType=1,@prmIdGameType=13,@prmIdSport='SOC',@prmLine=4,@prmOnline=1,@prmIdUser=0
// go
// exec WebGetProfileGameTypeData @prmIdProfile=1,@prmIdGameType=13
// go
