import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';
import { BasicAuthStrategy } from './strategies/basic-auth.strategy';

/**
 * Authentication module
 */
@Module({
  imports: [
    JwtModule.register({
      // I'm going to put it in base64
      privateKey: Buffer.from(
        process.env.JWT_PRIVATE_KEY || 'KJSDF89SDH38723RJ2039J09R230RM23904U23',
        'utf-8',
      ).toString('base64'),
      publicKey: Buffer.from(
        process.env.JWT_PUBLIC_KEY || 'KJSDF89SDH38723RJ2039J09R230RM23904U23',
        'utf-8',
      ).toString('base64'),
      signOptions: {
        expiresIn: Number(process.env.TOKEN_EXPIRES) || 3600, // Expiry time
        algorithm: 'HS512', // Encryption algorithm
      },
    }),
    PassportModule,
  ],
  exports: [JwtModule],
  // Authentication and authorization strategies
  providers: [JwtAuthStrategy, BasicAuthStrategy],
})
export class AuthModule {}
