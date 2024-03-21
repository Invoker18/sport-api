import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BcryptService } from '../../helpers/bcrypt.service'
import { UserEntity } from './entities/user.entity'
import { RoleEntity } from './entities/role.entity'
import { DATABASE_ENUM } from '../../config/database/enum';
import { AuthModule as GlobalAuthModule } from '../../auth/auth.module';


@Module({
  imports: [
    // Importamos el modulo de TypeOrm para tener el Repositorio de UserEntity y RoleEntity
    TypeOrmModule.forFeature([UserEntity, RoleEntity], DATABASE_ENUM.MSSQL_DGS),
    GlobalAuthModule,
  ],

  controllers: [AuthController],
  providers: [AuthService, BcryptService],
})
export class AuthModule {}