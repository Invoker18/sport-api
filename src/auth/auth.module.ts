import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';

/**
 * Authentication module
 */
@Module({
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
