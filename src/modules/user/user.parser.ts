import { Injectable } from "@nestjs/common";
import { UserQueryDto } from "./dtos/user.dto";

@Injectable()
export class UserParser {
    parseUserQuery(query: UserQueryDto): any {
        return {
            page: query.page || 1,
            perPage: query.perPage || 12,
            userName: query.userName,
            sortBy: query.sortBy || "userName",
            ascOrDesc: query.ascOrDesc || "asc",
            filterNameString: query.filterNameString,
            filterOperatorString: query.filterOperatorString,
            filterValue: query.filterValue,
        };
    }
}
