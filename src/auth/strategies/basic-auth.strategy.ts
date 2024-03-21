import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BasicStrategy } from 'passport-http';

/**
 * Class that implements the Passport basic authentication strategy
 */
@Injectable()
export class BasicAuthStrategy extends PassportStrategy(BasicStrategy) {
  constructor() {
    // We tell you that the request data that comes from the Header be passed to the callback
    super({ passReqToCallback: true });
  }

  /**
   * Method that validates the credentials of the request when it is of type Basic Auth
   * @param req
   * @param username
   * @param password
   */
  public validate = async (
    req: Request,
    username: string,
    password: string,
  ) => {
    // The credentials come in the header of the request and we compare them with the ones we have in the .env
    if (
      process.env.API_USER === username &&
      process.env.API_PASS === password
    ) {
      return true;
    }
    throw new UnauthorizedException('Credenciales invalidas');
  };
}
