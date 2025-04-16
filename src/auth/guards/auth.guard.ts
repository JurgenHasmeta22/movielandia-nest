import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard as PassportAuthGuard } from "@nestjs/passport";
import { UnauthorizedError } from "../../utils/error.util";

@Injectable()
export class AuthGuard extends PassportAuthGuard("jwt") {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        if (err || !user) {
            throw new UnauthorizedError("Authentication required");
        }
        return user;
    }
}
