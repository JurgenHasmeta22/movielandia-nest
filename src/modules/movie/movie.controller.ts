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
import { MovieService } from "./movie.service";
import { CreateMovieDto } from "./dtos/create-movie.dto";
import { UpdateMovieDto } from "./dtos/update-movie.dto";
import { MovieQueryDto } from "./dtos/movie-query.dto";
import { MovieListResponseDto, MovieDetailsDto, RelatedMoviesResponseDto } from "./dtos/movie-response.dto";
import { User } from "@prisma/client";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { OptionalAuthGuard } from "../../auth/guards/optional-auth.guard";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { ValidationError } from "../../utils/error.util";
import { getPaginationParams, createPaginatedResponse } from "../../utils/pagination.util";

@ApiTags("Movies")
@Controller("movies")
@UseGuards(OptionalAuthGuard)
export class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @Get()
    @ApiOperation({ summary: "Get all movies with filters and pagination" })
    @ApiResponse({ status: HttpStatus.OK, description: "Movies retrieved successfully", type: MovieListResponseDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid query parameters" })
    async findAll(
        @Query(new ValidationPipe({ transform: true })) query: MovieQueryDto,
        @CurrentUser() user?: User,
    ): Promise<MovieListResponseDto> {
        try {
            return await this.movieService.findAll(query, user?.id);
        } catch (error) {
            throw new ValidationError("Failed to fetch movies. Please check your query parameters.");
        }
    }

    @Get("latest")
    @ApiOperation({ summary: "Get latest movies" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Latest movies retrieved successfully",
        type: [MovieDetailsDto],
    })
    async findLatest(@CurrentUser() user?: User): Promise<MovieDetailsDto[]> {
        return this.movieService.findLatest(user?.id);
    }

    @Get("search")
    @ApiOperation({ summary: "Search movies by title" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Movies search results retrieved successfully",
        type: MovieListResponseDto,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid query parameters" })
    async search(
        @Query("title") title: string,
        @Query() query: MovieQueryDto,
        @CurrentUser() user?: User,
    ): Promise<MovieListResponseDto> {
        try {
            return await this.movieService.search(title, query, user?.id);
        } catch (error) {
            throw new ValidationError("Failed to search movies. Please check your query parameters.");
        }
    }

    @Get("count")
    @ApiOperation({ summary: "Get total count of movies" })
    @ApiResponse({ status: HttpStatus.OK, description: "Movies count retrieved successfully", type: Number })
    async count(): Promise<{ count: number }> {
        const count = await this.movieService.count();
        return { count };
    }

    @Get(":id")
    @ApiOperation({ summary: "Get movie by ID" })
    @ApiResponse({ status: HttpStatus.OK, description: "Movie retrieved successfully", type: MovieDetailsDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Movie not found" })
    async findOne(@Param("id", ParseIntPipe) id: number, @CurrentUser() user?: User): Promise<MovieDetailsDto> {
        return await this.movieService.findOne(id, user?.id);
    }

    @Get(":id/related")
    @ApiOperation({ summary: "Get related movies" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Related movies retrieved successfully",
        type: RelatedMoviesResponseDto,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Movie not found" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid query parameters" })
    async findRelated(
        @Param("id", ParseIntPipe) id: number,
        @Query("page", ParseIntPipe) page: number = 1,
        @Query("perPage", ParseIntPipe) perPage: number = 6,
        @CurrentUser() user?: User,
    ): Promise<RelatedMoviesResponseDto> {
        try {
            const paginationParams = getPaginationParams({ page, limit: perPage });
            return await this.movieService.findRelated(id, user?.id, paginationParams.page, paginationParams.take);
        } catch (error) {
            throw new ValidationError("Failed to fetch related movies. Please check your query parameters.");
        }
    }

    @Post()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Create a new movie" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Movie created successfully", type: MovieDetailsDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
    async create(@Body() createMovieDto: CreateMovieDto): Promise<MovieDetailsDto> {
        try {
            return await this.movieService.create(createMovieDto);
        } catch (error) {
            throw new ValidationError("Failed to create movie. Please check your input.");
        }
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Update a movie" })
    @ApiResponse({ status: HttpStatus.OK, description: "Movie updated successfully", type: MovieDetailsDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Movie not found" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateMovieDto: UpdateMovieDto,
    ): Promise<MovieDetailsDto> {
        return await this.movieService.update(id, updateMovieDto);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete a movie" })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "Movie deleted successfully" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Movie not found" })
    async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        await this.movieService.remove(id);
    }
}
