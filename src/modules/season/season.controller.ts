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
    ValidationPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { SeasonService } from "./season.service";
import { CreateSeasonDto } from "./dtos/create-season.dto";
import { UpdateSeasonDto } from "./dtos/update-season.dto";
import { SeasonQueryDto } from "./dtos/season-query.dto";
import { SeasonListResponseDto, SeasonDetailsDto } from "./dtos/season-response.dto";
import { User } from "@prisma/client";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { OptionalAuthGuard } from "../../auth/guards/optional-auth.guard";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { ValidationError } from "../../utils/error.util";

@ApiTags("Seasons")
@Controller("seasons")
@UseGuards(OptionalAuthGuard)
export class SeasonController {
    constructor(private readonly seasonService: SeasonService) {}

    @Get()
    @ApiOperation({ summary: "Get all seasons with filters and pagination" })
    @ApiResponse({ status: HttpStatus.OK, description: "Seasons retrieved successfully", type: SeasonListResponseDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid query parameters" })
    async findAll(
        @Query(new ValidationPipe({ transform: true })) query: SeasonQueryDto,
        @CurrentUser() user?: User,
    ): Promise<SeasonListResponseDto> {
        try {
            return await this.seasonService.findAll(query, user?.id);
        } catch (error) {
            throw new ValidationError("Failed to fetch seasons. Please check your query parameters.");
        }
    }

    @Get("search")
    @ApiOperation({ summary: "Search seasons by title" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Seasons search results retrieved successfully",
        type: SeasonListResponseDto,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid query parameters" })
    async search(
        @Query("title") title: string,
        @Query("page") page: number = 1,
        @Query("perPage") perPage: number = 12,
        @CurrentUser() user?: User,
    ): Promise<SeasonListResponseDto> {
        try {
            return await this.seasonService.search(title, user?.id, Number(page), Number(perPage));
        } catch (error) {
            throw new ValidationError("Failed to search seasons. Please check your query parameters.");
        }
    }

    @Get("serie/:serieId")
    @ApiOperation({ summary: "Get all seasons for a specific serie" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Seasons retrieved successfully",
        type: SeasonListResponseDto,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Serie not found" })
    async findBySerieId(
        @Param("serieId", ParseIntPipe) serieId: number,
        @CurrentUser() user?: User,
    ): Promise<SeasonListResponseDto> {
        return this.seasonService.findBySerieId(serieId, user?.id);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get season by ID" })
    @ApiResponse({ status: HttpStatus.OK, description: "Season retrieved successfully", type: SeasonDetailsDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Season not found" })
    async findOne(@Param("id", ParseIntPipe) id: number, @CurrentUser() user?: User): Promise<SeasonDetailsDto> {
        return this.seasonService.findOne(id, user?.id);
    }

    @Post()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: "Create a new season" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Season created successfully", type: SeasonDetailsDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid season data" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    async create(@Body(ValidationPipe) createSeasonDto: CreateSeasonDto): Promise<SeasonDetailsDto> {
        return this.seasonService.create(createSeasonDto);
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Update a season" })
    @ApiResponse({ status: HttpStatus.OK, description: "Season updated successfully", type: SeasonDetailsDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Season not found" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body(ValidationPipe) updateSeasonDto: UpdateSeasonDto,
    ): Promise<SeasonDetailsDto> {
        return this.seasonService.update(id, updateSeasonDto);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete a season" })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "Season deleted successfully" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Season not found" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.seasonService.delete(id);
    }
}
