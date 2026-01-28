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
import { SerieService } from "./serie.service";
import { CreateSerieDto } from "./dtos/create-serie.dto";
import { UpdateSerieDto } from "./dtos/update-serie.dto";
import { SerieQueryDto } from "./dtos/serie-query.dto";
import { SerieListResponseDto, SerieDetailsDto, RelatedSeriesResponseDto } from "./dtos/serie-response.dto";
import { User } from "@prisma/client";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { OptionalAuthGuard } from "../../auth/guards/optional-auth.guard";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { ValidationError } from "../../utils/error.util";
import { getPaginationParams, createPaginatedResponse } from "../../utils/pagination.util";

@ApiTags("Series")
@Controller("series")
@UseGuards(OptionalAuthGuard)
export class SerieController {
    constructor(private readonly serieService: SerieService) {}

    @Get()
    @ApiOperation({ summary: "Get all series with filters and pagination" })
    @ApiResponse({ status: HttpStatus.OK, description: "Series retrieved successfully", type: SerieListResponseDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid query parameters" })
    async findAll(
        @Query(new ValidationPipe({ transform: true })) query: SerieQueryDto,
        @CurrentUser() user?: User,
    ): Promise<SerieListResponseDto> {
        try {
            return await this.serieService.findAll(query, user?.id);
        } catch (error) {
            throw new ValidationError("Failed to fetch series. Please check your query parameters.");
        }
    }

    @Get("latest")
    @ApiOperation({ summary: "Get latest series" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Latest series retrieved successfully",
        type: [SerieDetailsDto],
    })
    async findLatest(@CurrentUser() user?: User): Promise<SerieDetailsDto[]> {
        return this.serieService.findLatest(user?.id);
    }

    @Get("search")
    @ApiOperation({ summary: "Search series by title" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Series search results retrieved successfully",
        type: SerieListResponseDto,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid query parameters" })
    async search(
        @Query("title") title: string,
        @Query() query: SerieQueryDto,
        @CurrentUser() user?: User,
    ): Promise<SerieListResponseDto> {
        try {
            return await this.serieService.search(title, query, user?.id);
        } catch (error) {
            throw new ValidationError("Failed to search series. Please check your query parameters.");
        }
    }

    @Get("genre/:genreId")
    @ApiOperation({ summary: "Get series by genre" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Series by genre retrieved successfully",
        type: SerieListResponseDto,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid query parameters" })
    async findByGenre(
        @Param("genreId", ParseIntPipe) genreId: number,
        @Query("page", ParseIntPipe) page: number = 1,
        @Query("perPage", ParseIntPipe) perPage: number = 12,
        @CurrentUser() user?: User,
    ): Promise<SerieListResponseDto> {
        try {
            return await this.serieService.findByGenre(genreId, user?.id, page, perPage);
        } catch (error) {
            throw new ValidationError("Failed to fetch series by genre. Please check your query parameters.");
        }
    }

    @Get("cast/:actorId")
    @ApiOperation({ summary: "Get series by cast member" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Series by cast member retrieved successfully",
        type: SerieListResponseDto,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid query parameters" })
    async findByCast(
        @Param("actorId", ParseIntPipe) actorId: number,
        @Query("page", ParseIntPipe) page: number = 1,
        @Query("perPage", ParseIntPipe) perPage: number = 12,
        @CurrentUser() user?: User,
    ): Promise<SerieListResponseDto> {
        try {
            return await this.serieService.findByCast(actorId, user?.id, page, perPage);
        } catch (error) {
            throw new ValidationError("Failed to fetch series by cast. Please check your query parameters.");
        }
    }

    @Get("crew/:crewId")
    @ApiOperation({ summary: "Get series by crew member" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Series by crew member retrieved successfully",
        type: SerieListResponseDto,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid query parameters" })
    async findByCrew(
        @Param("crewId", ParseIntPipe) crewId: number,
        @Query("page", ParseIntPipe) page: number = 1,
        @Query("perPage", ParseIntPipe) perPage: number = 12,
        @CurrentUser() user?: User,
    ): Promise<SerieListResponseDto> {
        try {
            return await this.serieService.findByCrew(crewId, user?.id, page, perPage);
        } catch (error) {
            throw new ValidationError("Failed to fetch series by crew. Please check your query parameters.");
        }
    }

    @Get("count")
    @ApiOperation({ summary: "Get total count of series" })
    @ApiResponse({ status: HttpStatus.OK, description: "Series count retrieved successfully", type: Number })
    async count(): Promise<{ count: number }> {
        const count = await this.serieService.count();
        return { count };
    }

    @Get(":id")
    @ApiOperation({ summary: "Get serie by ID" })
    @ApiResponse({ status: HttpStatus.OK, description: "Serie retrieved successfully", type: SerieDetailsDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Serie not found" })
    async findOne(@Param("id", ParseIntPipe) id: number, @CurrentUser() user?: User): Promise<SerieDetailsDto> {
        return await this.serieService.findOne(id, user?.id);
    }

    @Get(":id/related")
    @ApiOperation({ summary: "Get related series" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Related series retrieved successfully",
        type: RelatedSeriesResponseDto,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Serie not found" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid query parameters" })
    async findRelated(
        @Param("id", ParseIntPipe) id: number,
        @Query("page", ParseIntPipe) page: number = 1,
        @Query("perPage", ParseIntPipe) perPage: number = 6,
        @CurrentUser() user?: User,
    ): Promise<RelatedSeriesResponseDto> {
        try {
            const paginationParams = getPaginationParams({ page, limit: perPage });
            return await this.serieService.findRelated(id, user?.id, paginationParams.page, paginationParams.take);
        } catch (error) {
            throw new ValidationError("Failed to fetch related series. Please check your query parameters.");
        }
    }

    @Post()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Create a new serie" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Serie created successfully", type: SerieDetailsDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
    async create(@Body() createSerieDto: CreateSerieDto): Promise<SerieDetailsDto> {
        try {
            return await this.serieService.create(createSerieDto);
        } catch (error) {
            throw new ValidationError("Failed to create serie. Please check your input.");
        }
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Update a serie" })
    @ApiResponse({ status: HttpStatus.OK, description: "Serie updated successfully", type: SerieDetailsDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Serie not found" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateSerieDto: UpdateSerieDto,
    ): Promise<SerieDetailsDto> {
        return await this.serieService.update(id, updateSerieDto);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete a serie" })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "Serie deleted successfully" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Serie not found" })
    async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        await this.serieService.remove(id);
    }
}
