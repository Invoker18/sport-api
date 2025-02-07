import { Injectable } from '@nestjs/common';
import { apiKeys } from '../config/api/keys';
import { ApiKey } from './interfaces/api-key.interface';

@Injectable()
export class AuthService {
  private readonly apiKeys: ApiKey[] = apiKeys();

  validateApiKey(apiKey: string): ApiKey | undefined {
    return this.apiKeys.find((key) => key.key === apiKey);
  }
}
