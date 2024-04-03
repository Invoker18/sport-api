import {
  Controller,
  Get,
  Header,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WagerService } from './wager.service';
// import { BookIdValidatorPipe } from './pipes/book-id-validator.pipe'
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiInternalServerErrorResponse,
  ApiNotAcceptableResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKeyAuth } from '../../../decorator/auth.decorator';
import { GetActiveLeaguesQuery } from './dto/get-leagues.dto';
import { TransformInterceptor } from '../../../interceptor/transform.interceptor';

@Controller('proxy/wager')
@ApiKeyAuth()
@ApiTags('proxyWager')
export class WagerController {
  constructor(private readonly wagerService: WagerService) {}

  @Get('leagues')
  @Header('Content-Type', 'application/json')
  @UseInterceptors(TransformInterceptor)
  async getActiveLeagues(
    @Query() params: GetActiveLeaguesQuery,
  ): Promise<string> {
    let response: any;
    if (params.active == 1) {
      response = await this.wagerService.GetActiveLeagues({
        IdBook: params.book_id,
        IdProfile: params.book_id,
        IdLineType: params.book_id,
        WagerType: params.book_id,
        Language: params.book_id,
      });
    } else {
      response = await this.wagerService.GetAnonActiveLeagues({
        IdBook: params.book_id,
      });
    }
    return response;
  }
}
