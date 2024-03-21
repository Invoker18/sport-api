import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { User } from '../../../resources/auth/model/user.model'

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // el token como barer token
      ignoreExpiration: true, // ignora la expiracion
      // La clave secreta
      secretOrKey: Buffer.from(
        process.env.TOKEN_SECRET || 'KJSDF89SDH38723RJ2039J09R230RM23904U23',
        'utf-8',
      ).toString('base64'),
    });
  }

  async validate(payload: any) {
    return payload;
  }
  // Si se valida obtenemos el role
  // async validate(payload: User) {
    // console.log(payload)
    // return {
    //   id: payload.id,
    //   role: payload.role,
    //   username: payload.username,
    // }
  // }
}
