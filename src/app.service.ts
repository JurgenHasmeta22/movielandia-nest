import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    getIntro(): string {
        return "Movielandia24 REST API";
    }
}
