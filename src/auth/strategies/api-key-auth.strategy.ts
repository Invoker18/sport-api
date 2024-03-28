import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { apiKeyConstants } from '../../config/const/auth';

@Injectable()
export class ApiKeyAuthStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy
) {
  constructor(private authService: AuthService) {
    super(
      { header: apiKeyConstants.header, prefix: '' },
      true,
      (apikey, done, a) => {
        if (!apikey) {
            throw new UnauthorizedException('API key is missing.');
        }
        const checkKey = authService.validateApiKey(apikey, a.ip);

        // call your env. var the name you want
        if (!checkKey) {
            throw new UnauthorizedException('Invalid API key.');
        }
        return done(true);
      },
    );
  }
}
