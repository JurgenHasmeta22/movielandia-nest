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
import { EpisodeService } from "./episode.service";
import { CreateEpisodeDto } from "./dtos/create-episode.dto";
import { UpdateEpisodeDto } from "./dtos/update-episode.dto";
import { EpisodeQueryDto } from "./dtos/episode-query.dto";
import { EpisodeListResponseDto, EpisodeDetailsDto } from "./dtos/episode-response.dto";
import { User } from "@prisma/client";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { OptionalAuthGuard } from "../../auth/guards/optional-auth.guard";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { ValidationError } from "../../utils/error.util";

@ApiTags("Episodes")
@Controller("episodes")
@UseGuards(OptionalAuthGuard)
export class EpisodeController {
    constructor(private readonly episodeService: EpisodeService) {}

    @Get()
    @ApiOperation({ summary: "Get all episodes with filters and pagination" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Episodes retrieved successfully",
        type: EpisodeListResponseDto,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid query parameters" })
    async findAll(
        @Query(new ValidationPipe({ transform: true })) query: EpisodeQueryDto,
        @CurrentUser() user?: User,
    ): Promise<EpisodeListResponseDto> {
        try {
            return await this.episodeService.findAll(query, user?.id);
        } catch (error) {
            throw new ValidationError("Failed to fetch episodes. Please check your query parameters.");
        }
    }

    @Get("season/:seasonId")
    @ApiOperation({ summary: "Get all episodes for a specific season" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Episodes retrieved successfully",
        type: EpisodeListResponseDto,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Season not found" })
    async findBySeasonId(
        @Param("seasonId", ParseIntPipe) seasonId: number,
        @CurrentUser() user?: User,
    ): Promise<EpisodeListResponseDto> {
        return this.episodeService.findBySeasonId(seasonId, user?.id);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get episode by ID" })
    @ApiResponse({ status: HttpStatus.OK, description: "Episode retrieved successfully", type: EpisodeDetailsDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Episode not found" })
    async findOne(@Param("id", ParseIntPipe) id: number, @CurrentUser() user?: User): Promise<EpisodeDetailsDto> {
        return this.episodeService.findOne(id, user?.id);
    }

    @Post()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: "Create a new episode" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Episode created successfully", type: EpisodeDetailsDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid episode data" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    async create(@Body(ValidationPipe) createEpisodeDto: CreateEpisodeDto): Promise<EpisodeDetailsDto> {
        return this.episodeService.create(createEpisodeDto);
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Update an episode" })
    @ApiResponse({ status: HttpStatus.OK, description: "Episode updated successfully", type: EpisodeDetailsDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Episode not found" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body(ValidationPipe) updateEpisodeDto: UpdateEpisodeDto,
    ): Promise<EpisodeDetailsDto> {
        return this.episodeService.update(id, updateEpisodeDto);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete an episode" })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "Episode deleted successfully" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Episode not found" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.episodeService.delete(id);
    }
}
