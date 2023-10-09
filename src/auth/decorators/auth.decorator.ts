import { UseGuards, applyDecorators } from "@nestjs/common";
import { Roles } from "../enums/roles.enum";
import { RoleProtected } from "./role-protected.decorator";
import { AuthGuard } from "@nestjs/passport";
import { UserRoleGuard } from "../guards/user-role.guard";

export function Auth(...roles: Roles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard)
  )
}
