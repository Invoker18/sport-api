import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { apiKeyConstants } from '../../config/const/auth';

@Injectable()
export class ApiKeyAuthStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  validate(...args: any[]): unknown {
    throw new Error('Method not implemented.');
  }
  constructor(private authService: AuthService) {
    super(
      { header: apiKeyConstants.header, prefix: '' },
      true,
      (apikey: any, done: any, req: any) => {
        if (!apikey) {
          throw new UnauthorizedException('API key is missing.');
        }
        let ip =
          req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          req.ip;
        ip = ip.toString().replace('::ffff:', '');
        const checkKey = authService.validateApiKey(apikey, ip);

        // call your env. var the name you want
        if (!checkKey) {
          throw new UnauthorizedException('Invalid API key.');
        }
        return done(true);
      },
    );
  }
}
