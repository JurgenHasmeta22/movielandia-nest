import { Injectable } from "@nestjs/common";
import { HandleInertiaRequests, InertiaService } from "inertia-nestjs";
import { Request } from "express";
import { PrismaService } from "../prisma.service";

@Injectable()
export class InertiaShareMiddleware extends HandleInertiaRequests {
    constructor(
        inertia: InertiaService,
        private readonly prisma: PrismaService,
    ) {
        super(inertia);
    }

    async share(req: Request) {
        const base = await super.share(req);
        const userId = (req.session as any)?.userId as number | undefined;

        let authUser: { id: number; userName: string; email: string; avatar: string | null } | null = null;

        if (userId) {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { id: true, userName: true, email: true, avatar: { select: { photoSrc: true } } },
            });

            if (user) {
                authUser = {
                    id: user.id,
                    userName: user.userName,
                    email: user.email,
                    avatar: user.avatar?.photoSrc ?? null,
                };
            }
        }

        const flash = (req.session as any)?.flash ?? null;

        if ((req.session as any)?.flash) {
            delete (req.session as any).flash;
        }

        return {
            ...base,
            auth: { user: authUser },
            flash,
        };
    }
}
