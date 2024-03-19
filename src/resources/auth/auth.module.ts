import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BcryptService } from '../../common/bcrypt.service'
import { JwtModule } from '@nestjs/jwt'
import * as process from 'process'
import { UserEntity } from './entities/user.entity'
import { RoleEntity } from './entities/role.entity'
import { string } from 'joi'
import { DATABASE_ENUM } from '../../config/database/enum';

@Module({
  imports: [
    // Importamos el modulo de TypeOrm para tener el Repositorio de UserEntity y RoleEntity
    TypeOrmModule.forFeature([UserEntity, RoleEntity], DATABASE_ENUM.MSSQL_DGS), 
    JwtModule.register({
      // Lo voy a poner en base64
      secret: Buffer.from(
        process.env.TOKEN_SECRET ||
          'KJSDF89SDH38723RJ2039J09R230RM23904U23',
        'utf-8',
      ).toString('base64'),
      signOptions: {
        expiresIn: Number(process.env.TOKEN_EXPIRES) || 3600, // Tiempo de expiracion
        algorithm: 'HS512', // Algoritmo de encriptacion
      },
    }),
    
  ],
  controllers: [AuthController],
  providers: [AuthService, BcryptService],
})
export class AuthModule {}