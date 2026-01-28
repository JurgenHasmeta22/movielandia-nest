import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    ParseIntPipe,
    HttpStatus,
    UseGuards,
    HttpCode,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { ListService } from "./list.service";
import { CreateListDto, UpdateListDto, ListDto, CreateListShareDto, ListShareDto } from "./dtos/list.dto";
import { AddListItemDto, UpdateListItemDto, ListItemDto } from "./dtos/list-item.dto";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { OptionalAuthGuard } from "../../auth/guards/optional-auth.guard";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { User } from "@prisma/client";

@ApiTags("Lists")
@Controller("lists")
@UseGuards(OptionalAuthGuard)
export class ListController {
    constructor(private readonly listService: ListService) {}

    @Get()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get all lists for authenticated user" })
    @ApiResponse({ status: HttpStatus.OK, description: "Lists retrieved successfully", type: [ListDto] })
    async findAllByUser(@CurrentUser() user: User) {
        return this.listService.findAllByUser(user.id);
    }

    @Get("shared-with-me")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get lists shared with authenticated user" })
    @ApiResponse({ status: HttpStatus.OK, description: "Shared lists retrieved successfully" })
    async getSharedWithMe(@CurrentUser() user: User) {
        return this.listService.getSharedWithMe(user.id);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get list by id" })
    @ApiResponse({ status: HttpStatus.OK, description: "List retrieved successfully", type: ListDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "List not found" })
    async findListById(@Param("id", ParseIntPipe) id: number, @CurrentUser() user?: User) {
        return this.listService.findListById(id, user?.id);
    }

    @Post()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Create a new list" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "List created successfully", type: ListDto })
    async createList(@CurrentUser() user: User, @Body() createListDto: CreateListDto) {
        return this.listService.createList(user.id, createListDto);
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Update a list" })
    @ApiResponse({ status: HttpStatus.OK, description: "List updated successfully", type: ListDto })
    async updateList(
        @Param("id", ParseIntPipe) id: number,
        @CurrentUser() user: User,
        @Body() updateListDto: UpdateListDto,
    ) {
        return this.listService.updateList(id, user.id, updateListDto);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete a list" })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "List deleted successfully" })
    async deleteList(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: User) {
        await this.listService.deleteList(id, user.id);
    }

    @Post(":id/movies")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Add movie to list" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Movie added to list successfully" })
    async addMovieToList(
        @Param("id", ParseIntPipe) id: number,
        @CurrentUser() user: User,
        @Body() addListItemDto: AddListItemDto,
    ) {
        return this.listService.addMovieToList(id, user.id, addListItemDto);
    }

    @Delete(":id/movies/:movieId")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Remove movie from list" })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "Movie removed from list successfully" })
    async removeMovieFromList(
        @Param("id", ParseIntPipe) id: number,
        @Param("movieId", ParseIntPipe) movieId: number,
        @CurrentUser() user: User,
    ) {
        await this.listService.removeMovieFromList(id, movieId, user.id);
    }

    @Post(":id/series")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Add series to list" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Series added to list successfully" })
    async addSeriesToList(
        @Param("id", ParseIntPipe) id: number,
        @CurrentUser() user: User,
        @Body() addListItemDto: AddListItemDto,
    ) {
        return this.listService.addSeriesToList(id, user.id, addListItemDto);
    }

    @Delete(":id/series/:serieId")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Remove series from list" })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "Series removed from list successfully" })
    async removeSeriesFromList(
        @Param("id", ParseIntPipe) id: number,
        @Param("serieId", ParseIntPipe) serieId: number,
        @CurrentUser() user: User,
    ) {
        await this.listService.removeSeriesFromList(id, serieId, user.id);
    }

    @Post(":id/seasons")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Add season to list" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Season added to list successfully" })
    async addSeasonToList(
        @Param("id", ParseIntPipe) id: number,
        @CurrentUser() user: User,
        @Body() addListItemDto: AddListItemDto,
    ) {
        return this.listService.addSeasonToList(id, user.id, addListItemDto);
    }

    @Post(":id/episodes")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Add episode to list" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Episode added to list successfully" })
    async addEpisodeToList(
        @Param("id", ParseIntPipe) id: number,
        @CurrentUser() user: User,
        @Body() addListItemDto: AddListItemDto,
    ) {
        return this.listService.addEpisodeToList(id, user.id, addListItemDto);
    }

    @Post(":id/actors")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Add actor to list" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Actor added to list successfully" })
    async addActorToList(
        @Param("id", ParseIntPipe) id: number,
        @CurrentUser() user: User,
        @Body() addListItemDto: AddListItemDto,
    ) {
        return this.listService.addActorToList(id, user.id, addListItemDto);
    }

    @Post(":id/crew")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Add crew member to list" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Crew member added to list successfully" })
    async addCrewToList(
        @Param("id", ParseIntPipe) id: number,
        @CurrentUser() user: User,
        @Body() addListItemDto: AddListItemDto,
    ) {
        return this.listService.addCrewToList(id, user.id, addListItemDto);
    }

    @Post(":id/share")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Share list with another user" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "List shared successfully", type: ListShareDto })
    async shareList(
        @Param("id", ParseIntPipe) id: number,
        @CurrentUser() user: User,
        @Body() createListShareDto: CreateListShareDto,
    ) {
        return this.listService.shareList(id, user.id, createListShareDto);
    }

    @Delete(":id/share/:userId")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Unshare list with a user" })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "List unshared successfully" })
    async unshareList(
        @Param("id", ParseIntPipe) id: number,
        @Param("userId", ParseIntPipe) sharedUserId: number,
        @CurrentUser() user: User,
    ) {
        await this.listService.unshareList(id, user.id, sharedUserId);
    }
}
