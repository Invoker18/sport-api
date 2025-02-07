// src/auth/guards/api-key.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { apiKeys } from 'src/config/api/keys';
import { ApiKey } from '../interfaces/api-key.interface';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly apiKeys: ApiKey[] = apiKeys();

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'] as string;
    const clientIp =
      request.ip ||
      (request.headers['x-forwarded-for'] || '').toString().split(',')[0];

    if (!apiKey) {
      throw new UnauthorizedException('API Key no proporcionada');
    }

    const validApiKey = this.apiKeys.find((key) => key.key === apiKey) as ApiKey;

    if (!validApiKey) {
      throw new UnauthorizedException('API Key inválida');
    }

    if (validApiKey.ips[0] !== 'All' && !validApiKey.ips.includes(clientIp)) {
      throw new UnauthorizedException('IP no autorizada');
    }

    if (validApiKey.expires_at < Date.now() / 1000) {
      throw new UnauthorizedException('API Key expirada');
    }

    // Agregar la información de la API Key al request para uso posterior si es necesario
    request['apiKey'] = validApiKey as ApiKey;

    return true;
  }
}
