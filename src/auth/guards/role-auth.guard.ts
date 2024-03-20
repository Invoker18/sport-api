import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
//   import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleAuthGuard implements CanActivate {
  private roles: string[] = [];

  // constructor(private reflector: Reflector) {}

  constructor(...roles: string[]) {
    console.log(roles);
    this.roles = roles;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user } = context.switchToHttp().getRequest();
    // console.log('roles', this.roles)
    // console.log('user', user)
    if (!this.roles.includes(user.role)) {
      throw new ForbiddenException('Forbidden Role: You do not have access');
    }
    return true;
  }

  // canActivate(context: ExecutionContext): boolean {
  //     const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
  //       context.getHandler(),
  //       context.getClass(),
  //     ]);
  //     if (!requiredRoles) {
  //       return true;
  //     }
  //     const { user } = context.switchToHttp().getRequest();
  //     return requiredRoles.some((role) => user.roles?.includes(role));
  // }
}
