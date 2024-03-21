import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export function BasicAuth(/*...roles: Role[]*/) {
  return applyDecorators(
    // SetMetadata('roles', roles),
    UseGuards(BasicAuthGuard),
    ApiBasicAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function JwtAuth(/*...roles: Role[]*/) {
  return applyDecorators(
    // SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
