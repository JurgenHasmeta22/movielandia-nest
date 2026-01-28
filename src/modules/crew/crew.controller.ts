import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Query,
    ParseIntPipe,
    HttpStatus,
    HttpCode,
    UseGuards,
    BadRequestException,
    ValidationPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { CrewService } from "./crew.service";
import { CreateCrewDto } from "./dtos/create-crew.dto";
import { UpdateCrewDto } from "./dtos/update-crew.dto";
import { CrewQueryDto } from "./dtos/crew-query.dto";
import { CrewListResponseDto, CrewDetailsDto } from "./dtos/crew-response.dto";
import { User } from "@prisma/client";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { OptionalAuthGuard } from "../../auth/guards/optional-auth.guard";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { ValidationError } from "../../utils/error.util";

@ApiTags("Crew")
@Controller("crew")
@UseGuards(OptionalAuthGuard)
export class CrewController {
    constructor(private readonly crewService: CrewService) {}

    @Get()
    @ApiOperation({ summary: "Get all crew members with filters and pagination" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Crew members retrieved successfully",
        type: CrewListResponseDto,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid query parameters" })
    async findAll(
        @Query(new ValidationPipe({ transform: true })) query: CrewQueryDto,
        @CurrentUser() user?: User,
    ): Promise<CrewListResponseDto> {
        try {
            return await this.crewService.findAll(query, user?.id);
        } catch (error) {
            throw new ValidationError("Failed to fetch crew members. Please check your query parameters.");
        }
    }

    @Get("search")
    @ApiOperation({ summary: "Search crew members by name" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Crew members search results retrieved successfully",
        type: CrewListResponseDto,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid query parameters" })
    async search(
        @Query("fullname") fullname: string,
        @Query("page", ParseIntPipe) page: number = 1,
        @Query("perPage", ParseIntPipe) perPage: number = 12,
        @CurrentUser() user?: User,
    ): Promise<CrewListResponseDto> {
        try {
            return await this.crewService.search(fullname, user?.id, page, perPage);
        } catch (error) {
            throw new ValidationError("Failed to search crew members. Please check your query parameters.");
        }
    }

    @Get("count")
    @ApiOperation({ summary: "Get total count of crew members" })
    @ApiResponse({ status: HttpStatus.OK, description: "Crew members count retrieved successfully", type: Number })
    async count(): Promise<{ count: number }> {
        const count = await this.crewService.count();
        return { count };
    }

    @Get(":id")
    @ApiOperation({ summary: "Get crew member by ID" })
    @ApiResponse({ status: HttpStatus.OK, description: "Crew member retrieved successfully", type: CrewDetailsDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Crew member not found" })
    async findOne(@Param("id", ParseIntPipe) id: number, @CurrentUser() user?: User): Promise<CrewDetailsDto> {
        return await this.crewService.findOne(id, user?.id);
    }

    @Post()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Create a new crew member" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Crew member created successfully", type: CrewDetailsDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
    async create(@Body() createCrewDto: CreateCrewDto): Promise<CrewDetailsDto> {
        try {
            return await this.crewService.create(createCrewDto);
        } catch (error) {
            throw new ValidationError("Failed to create crew member. Please check your input.");
        }
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Update a crew member" })
    @ApiResponse({ status: HttpStatus.OK, description: "Crew member updated successfully", type: CrewDetailsDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Crew member not found" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
    async update(@Param("id", ParseIntPipe) id: number, @Body() updateCrewDto: UpdateCrewDto): Promise<CrewDetailsDto> {
        return await this.crewService.update(id, updateCrewDto);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete a crew member" })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "Crew member deleted successfully" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Crew member not found" })
    async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        await this.crewService.remove(id);
    }
}
