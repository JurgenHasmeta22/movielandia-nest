import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common";

/** Passes silently whether or not the user is authenticated. */
@Injectable()
export class OptionalAuthGuard implements CanActivate {
    canActivate(_context: ExecutionContext): boolean {
        return true;
    }
}
