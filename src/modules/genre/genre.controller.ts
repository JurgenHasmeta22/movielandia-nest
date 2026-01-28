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
import { GenreService } from "./genre.service";
import { CreateGenreDto } from "./dtos/create-genre.dto";
import { UpdateGenreDto } from "./dtos/update-genre.dto";
import { GenreQueryDto } from "./dtos/genre-query.dto";
import { GenreListResponseDto, GenreDetailsDto } from "./dtos/genre-response.dto";
import { User } from "@prisma/client";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { OptionalAuthGuard } from "../../auth/guards/optional-auth.guard";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { ValidationError } from "../../utils/error.util";

@ApiTags("Genres")
@Controller("genres")
@UseGuards(OptionalAuthGuard)
export class GenreController {
    constructor(private readonly genreService: GenreService) {}

    @Get()
    @ApiOperation({ summary: "Get all genres with filters and pagination" })
    @ApiResponse({ status: HttpStatus.OK, description: "Genres retrieved successfully", type: GenreListResponseDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid query parameters" })
    async findAll(
        @Query(new ValidationPipe({ transform: true })) query: GenreQueryDto,
        @CurrentUser() user?: User,
    ): Promise<GenreListResponseDto> {
        try {
            return await this.genreService.findAll(query, user?.id);
        } catch (error) {
            throw new ValidationError("Failed to fetch genres. Please check your query parameters.");
        }
    }

    @Get("search")
    @ApiOperation({ summary: "Search genres by name" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Genres search results retrieved successfully",
        type: GenreListResponseDto,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid query parameters" })
    async search(
        @Query("name") name: string,
        @Query("page", ParseIntPipe) page: number = 1,
        @Query("perPage", ParseIntPipe) perPage: number = 20,
        @CurrentUser() user?: User,
    ): Promise<GenreListResponseDto> {
        try {
            return await this.genreService.search(name, user?.id, page, perPage);
        } catch (error) {
            throw new ValidationError("Failed to search genres. Please check your query parameters.");
        }
    }

    @Get("count")
    @ApiOperation({ summary: "Get total count of genres" })
    @ApiResponse({ status: HttpStatus.OK, description: "Genres count retrieved successfully", type: Number })
    async count(): Promise<{ count: number }> {
        const count = await this.genreService.count();
        return { count };
    }

    @Get(":id")
    @ApiOperation({ summary: "Get genre by ID" })
    @ApiResponse({ status: HttpStatus.OK, description: "Genre retrieved successfully", type: GenreDetailsDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Genre not found" })
    async findOne(@Param("id", ParseIntPipe) id: number, @CurrentUser() user?: User): Promise<GenreDetailsDto> {
        return await this.genreService.findOne(id, user?.id);
    }

    @Post()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Create a new genre" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Genre created successfully", type: GenreDetailsDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
    async create(@Body() createGenreDto: CreateGenreDto): Promise<GenreDetailsDto> {
        try {
            return await this.genreService.create(createGenreDto);
        } catch (error) {
            throw new ValidationError("Failed to create genre. Please check your input.");
        }
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Update a genre" })
    @ApiResponse({ status: HttpStatus.OK, description: "Genre updated successfully", type: GenreDetailsDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Genre not found" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateGenreDto: UpdateGenreDto,
    ): Promise<GenreDetailsDto> {
        return await this.genreService.update(id, updateGenreDto);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete a genre" })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "Genre deleted successfully" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Genre not found" })
    async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        await this.genreService.remove(id);
    }
}
