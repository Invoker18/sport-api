import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthMiddleware } from './auth.middleware';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyAuthStrategy } from './strategies/api-key-auth.strategy';
import { AuthService } from './auth.service';

/**
 * Authentication module
 */
@Module({
  imports: [
    PassportModule,
  ],
  exports: [],
  // Authentication and authorization strategies
  providers: [
    AuthService,
    ApiKeyAuthStrategy,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
