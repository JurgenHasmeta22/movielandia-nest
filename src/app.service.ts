import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class AppService {
    constructor(private readonly prisma: PrismaService) {}

    async getHomeData() {
        const [totalMovies, totalSeries, totalActors] = await Promise.all([
            this.prisma.movie.count(),
            this.prisma.serie.count(),
            this.prisma.actor.count(),
        ]);
        return { totalMovies, totalSeries, totalActors };
    }
}
