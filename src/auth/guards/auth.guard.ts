import { Injectable, ExecutionContext, CanActivate, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        if (!req.session?.userId) {
            throw new UnauthorizedException("Authentication required. Please log in.");
        }
        return true;
    }
}
