import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { apiKeys } from '../config/api/keys';

@Injectable()
export class AuthService {

  validateApiKey(apiKey: string, ip: string) {
    return apiKeys().find(
      (apiK) =>
        apiKey === apiK.key &&
        apiK.ips.find((ipK) => ip === ipK || ipK === 'All') &&
        Date.now() > apiK.expires_at,
    );
  }
}
