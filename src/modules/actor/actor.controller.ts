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
import { ActorService } from "./actor.service";
import { CreateActorDto } from "./dtos/create-actor.dto";
import { UpdateActorDto } from "./dtos/update-actor.dto";
import { ActorQueryDto } from "./dtos/actor-query.dto";
import { ActorListResponseDto, ActorDetailsDto } from "./dtos/actor-response.dto";
import { User } from "@prisma/client";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { OptionalAuthGuard } from "../../auth/guards/optional-auth.guard";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { ValidationError } from "../../utils/error.util";

@ApiTags("Actors")
@Controller("actors")
@UseGuards(OptionalAuthGuard)
export class ActorController {
    constructor(private readonly actorService: ActorService) {}

    @Get()
    @ApiOperation({ summary: "Get all actors with filters and pagination" })
    @ApiResponse({ status: HttpStatus.OK, description: "Actors retrieved successfully", type: ActorListResponseDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid query parameters" })
    async findAll(
        @Query(new ValidationPipe({ transform: true })) query: ActorQueryDto,
        @CurrentUser() user?: User,
    ): Promise<ActorListResponseDto> {
        try {
            return await this.actorService.findAll(query, user?.id);
        } catch (error) {
            throw new ValidationError("Failed to fetch actors. Please check your query parameters.");
        }
    }

    @Get("search")
    @ApiOperation({ summary: "Search actors by name" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Actors search results retrieved successfully",
        type: ActorListResponseDto,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid query parameters" })
    async search(
        @Query("fullname") fullname: string,
        @Query("page", ParseIntPipe) page: number = 1,
        @Query("perPage", ParseIntPipe) perPage: number = 12,
        @CurrentUser() user?: User,
    ): Promise<ActorListResponseDto> {
        try {
            return await this.actorService.search(fullname, user?.id, page, perPage);
        } catch (error) {
            throw new ValidationError("Failed to search actors. Please check your query parameters.");
        }
    }

    @Get("count")
    @ApiOperation({ summary: "Get total count of actors" })
    @ApiResponse({ status: HttpStatus.OK, description: "Actors count retrieved successfully", type: Number })
    async count(): Promise<{ count: number }> {
        const count = await this.actorService.count();
        return { count };
    }

    @Get(":id")
    @ApiOperation({ summary: "Get actor by ID" })
    @ApiResponse({ status: HttpStatus.OK, description: "Actor retrieved successfully", type: ActorDetailsDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Actor not found" })
    async findOne(@Param("id", ParseIntPipe) id: number, @CurrentUser() user?: User): Promise<ActorDetailsDto> {
        return await this.actorService.findOne(id, user?.id);
    }

    @Post()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Create a new actor" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Actor created successfully", type: ActorDetailsDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
    async create(@Body() createActorDto: CreateActorDto): Promise<ActorDetailsDto> {
        try {
            return await this.actorService.create(createActorDto);
        } catch (error) {
            throw new ValidationError("Failed to create actor. Please check your input.");
        }
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Update an actor" })
    @ApiResponse({ status: HttpStatus.OK, description: "Actor updated successfully", type: ActorDetailsDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Actor not found" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateActorDto: UpdateActorDto,
    ): Promise<ActorDetailsDto> {
        return await this.actorService.update(id, updateActorDto);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete an actor" })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "Actor deleted successfully" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Actor not found" })
    async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        await this.actorService.remove(id);
    }
}
