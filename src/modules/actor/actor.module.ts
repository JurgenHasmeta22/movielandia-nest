import { Module } from "@nestjs/common";
import { ActorController } from "./actor.controller";
import { ActorService } from "./actor.service";

@Module({
    controllers: [ActorController],
    providers: [ActorService],
    exports: [ActorService],
})
export class ActorModule {}
