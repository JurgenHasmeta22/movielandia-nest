import { Module } from "@nestjs/common";
import { ListService } from "./list.service";
import { ListController } from "./list.controller";
import { PrismaService } from "../../prisma.service";

@Module({
    controllers: [ListController],
    providers: [ListService, PrismaService],
    exports: [ListService],
})
export class ListModule {}
