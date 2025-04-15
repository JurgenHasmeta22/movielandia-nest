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
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { MovieService } from "./movie.service";
import { CreateMovieDto } from "./dtos/create-movie.dto";
import { UpdateMovieDto } from "./dtos/update-movie.dto";
import { MovieQueryDto } from "./dtos/movie-query.dto";
import { MovieListResponseDto, MovieDetailsDto, RelatedMoviesResponseDto } from "./dtos/movie-response.dto";
import { User } from "@prisma/client";
import { CurrentUser } from "../../decorators/current-user.decorator";
import { OptionalAuthGuard } from "../../guards/optional-auth.guard";
import { AuthGuard } from "../../guards/auth.guard";

@ApiTags("Movies")
@Controller("movies")
@UseGuards(OptionalAuthGuard)
export class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @Get()
    @ApiOperation({ summary: "Get all movies with filters and pagination" })
    @ApiResponse({ status: HttpStatus.OK, description: "Movies retrieved successfully", type: MovieListResponseDto })
    async findAll(@Query() query: MovieQueryDto, @CurrentUser() user?: User): Promise<MovieListResponseDto> {
        return this.movieService.findAll(query, user?.id);
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
    async search(
        @Query("title") title: string,
        @Query() query: MovieQueryDto,
        @CurrentUser() user?: User,
    ): Promise<MovieListResponseDto> {
        return this.movieService.search(title, query, user?.id);
    }

    @Get("count")
    @ApiOperation({ summary: "Get total count of movies" })
    @ApiResponse({ status: HttpStatus.OK, description: "Movies count retrieved successfully", type: Number })
    async count(): Promise<number> {
        return this.movieService.count();
    }

    @Get(":id")
    @ApiOperation({ summary: "Get movie by ID" })
    @ApiResponse({ status: HttpStatus.OK, description: "Movie retrieved successfully", type: MovieDetailsDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Movie not found" })
    async findOne(@Param("id", ParseIntPipe) id: number, @CurrentUser() user?: User): Promise<MovieDetailsDto> {
        return this.movieService.findOne(id, user?.id);
    }

    @Get(":id/related")
    @ApiOperation({ summary: "Get related movies" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Related movies retrieved successfully",
        type: RelatedMoviesResponseDto,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Movie not found" })
    async findRelated(
        @Param("id", ParseIntPipe) id: number,
        @Query("page", ParseIntPipe) page: number = 1,
        @Query("perPage", ParseIntPipe) perPage: number = 6,
        @CurrentUser() user?: User,
    ): Promise<RelatedMoviesResponseDto> {
        return this.movieService.findRelated(id, user?.id, page, perPage);
    }

    @Post()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Create a new movie" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Movie created successfully", type: MovieDetailsDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
    async create(@Body() createMovieDto: CreateMovieDto): Promise<MovieDetailsDto> {
        return this.movieService.create(createMovieDto);
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
        return this.movieService.update(id, updateMovieDto);
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
