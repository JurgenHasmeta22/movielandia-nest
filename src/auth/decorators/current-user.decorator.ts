import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/** Returns req.session.userId — the session-stored user id. */
export const CurrentUserId = createParamDecorator((_data: unknown, ctx: ExecutionContext): number | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.session?.userId as number | undefined;
});

/** Backwards-compat alias — returns the whole resolved user from req.user if set. */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user ?? null;
});
