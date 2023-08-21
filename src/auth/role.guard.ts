import { Injectable, CanActivate, ExecutionContext, UseFilters, Request, UseGuards, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorateor';
import { AuthGuard } from 'src/auth/auth.guard';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    // @UseGuards(AuthGuard)
    @UseFilters(HttpExceptionFilter)
    async canActivate(context: ExecutionContext): Promise<boolean> {

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            console.log('No role!!! ...');
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const payload = request.payload
        // console.log("Payload Role: -->", request.payload.role);
        // console.log("requiredRoles:", requiredRoles);

        const isAuth = requiredRoles.includes(payload.role)
        if (!isAuth) {
            console.log("🚫 You are not authorized to perform the operation 🚫");
            throw new ForbiddenException("🚫 You are not authorized to perform the operation 🚫")
        }
        return isAuth;
    }
}