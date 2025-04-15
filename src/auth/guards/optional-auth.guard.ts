import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalAuthGuard extends AuthGuard("jwt") {
    handleRequest(err: any, user: any) {
        return user;
    }

    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }
}
