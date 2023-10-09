import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { META_ROLES } from "../decorators/role-protected.decorator";
import { User } from "../entities/user.entity";

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const validateRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if(!validateRoles || validateRoles.length === 0) return true;

    if(!user) {
      throw new BadRequestException('User not found');
    }

    for (const role of validateRoles) {
      if(user.roles.includes(role)) return true;
    }

    throw new BadRequestException('User not authorized')
  }
}
