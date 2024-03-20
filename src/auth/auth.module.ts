import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';
import { BasicAuthStrategy } from './strategies/basic-auth.strategy';

/**
 * Módulo de autenticación
 */
@Module({
  imports: [
    JwtModule.register({
      // Lo voy a poner en base64
      secret: Buffer.from(
        process.env.TOKEN_SECRET || 'KJSDF89SDH38723RJ2039J09R230RM23904U23',
        'utf-8',
      ).toString('base64'),
      signOptions: {
        expiresIn: Number(process.env.TOKEN_EXPIRES) || 3600, // Tiempo de expiracion
        algorithm: 'HS512', // Algoritmo de encriptacion
      },
    }),
    PassportModule,
  ],
  exports: [JwtModule],
  // Estrategias de autenticacion y autorizacion
  providers: [JwtAuthStrategy, BasicAuthStrategy],
})
export class AuthModule {}
