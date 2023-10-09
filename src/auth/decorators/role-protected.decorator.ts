import { SetMetadata } from "@nestjs/common";
import { Roles } from "../enums/roles.enum";

export const META_ROLES = 'roles';

export const RoleProtected = (...args: Roles[]) => SetMetadata(META_ROLES, args);
