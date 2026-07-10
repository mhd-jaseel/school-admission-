import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';

// Decorator that allows attaching required user roles (e.g. parent, admission_team) to endpoint handlers.
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
