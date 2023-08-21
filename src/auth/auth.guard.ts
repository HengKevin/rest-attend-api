import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    UseFilters
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { error } from 'console';
import { Request } from 'express';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    @UseFilters(HttpExceptionFilter)
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            console.log("🚫 Invalid Token 🚫");
            throw new UnauthorizedException("🚫 Invalid Token 🚫");
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: process.env.JWT_ACCESS_SECRET
                }
            );

            const isTokenExpired = Date.now() >= payload.exp * 1000;
            if (isTokenExpired) {
                console.log("🚫 Expired Token 🚫");
                throw new UnauthorizedException("🚫 Expired Token 🚫");
            }
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['payload'] = payload;
        } catch (error) {
            console.log("🚫 Unauthorized 🚫");
            throw new UnauthorizedException("🚫 Unauthorized 🚫");
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}