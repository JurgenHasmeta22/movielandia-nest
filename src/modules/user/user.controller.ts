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
import { UserService } from "./user.service";
import {
    UserQueryDto,
    UsersListResponseDto,
    AddFavoriteDto,
    RemoveFavoriteDto,
    GetFavoritesQueryDto,
    FavoritesListResponseDto,
    FollowDto,
    UnfollowDto,
    FollowRequestDto,
    FollowListResponseDto,
    SendMessageDto,
    MessagesListResponseDto,
    UserProfileDto,
    AddReviewDto,
    UpdateReviewDto,
    RemoveReviewDto,
} from "./dtos/user.dto";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { OptionalAuthGuard } from "../../auth/guards/optional-auth.guard";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { User } from "@prisma/client";

@ApiTags("Users")
@Controller("users")
@UseGuards(OptionalAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @ApiOperation({ summary: "Get all users with filters and pagination" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Users retrieved successfully",
        type: UsersListResponseDto,
    })
    async findAll(@Query(new ValidationPipe({ transform: true })) query: UserQueryDto): Promise<UsersListResponseDto> {
        return this.userService.getUsersWithFilters(query);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get user by ID" })
    @ApiResponse({ status: HttpStatus.OK, description: "User retrieved successfully", type: UserProfileDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User not found" })
    async findOne(@Param("id", ParseIntPipe) id: number): Promise<UserProfileDto> {
        return this.userService.getUserById(id);
    }

    @Post("favorites")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Add item to favorites" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Item added to favorites successfully" })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: "Item already in favorites" })
    async addFavorite(@CurrentUser() user: User, @Body() dto: AddFavoriteDto): Promise<{ message: string }> {
        await this.userService.addFavorite(user.id, dto.itemId, dto.type);
        return { message: "Item added to favorites" };
    }

    @Delete("favorites")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Remove item from favorites" })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "Item removed from favorites successfully" })
    async removeFavorite(@CurrentUser() user: User, @Body() dto: RemoveFavoriteDto): Promise<void> {
        await this.userService.removeFavorite(user.id, dto.itemId, dto.type);
    }

    @Get("favorites/list")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get user favorites by type" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Favorites retrieved successfully",
        type: FavoritesListResponseDto,
    })
    async getFavorites(
        @CurrentUser() user: User,
        @Query(new ValidationPipe({ transform: true })) query: GetFavoritesQueryDto,
    ): Promise<FavoritesListResponseDto> {
        return this.userService.getFavorites(user.id, query.type, query.page || 1, query.search || "");
    }

    @Post("follow")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Follow a user" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "User followed successfully" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid request" })
    async follow(@CurrentUser() user: User, @Body() dto: FollowDto): Promise<{ message: string }> {
        await this.userService.follow(user.id, dto.followingId);
        return { message: "User followed successfully" };
    }

    @Post("unfollow")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Unfollow a user" })
    @ApiResponse({ status: HttpStatus.OK, description: "User unfollowed successfully" })
    async unfollow(@CurrentUser() user: User, @Body() dto: UnfollowDto): Promise<{ message: string }> {
        await this.userService.unfollow(user.id, dto.followingId);
        return { message: "User unfollowed successfully" };
    }

    @Post("follow-requests/accept")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Accept follow request" })
    @ApiResponse({ status: HttpStatus.OK, description: "Follow request accepted successfully" })
    async acceptFollowRequest(@CurrentUser() user: User, @Body() dto: FollowRequestDto): Promise<{ message: string }> {
        await this.userService.acceptFollowRequest(dto.followerId, user.id);
        return { message: "Follow request accepted" };
    }

    @Post("follow-requests/reject")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Reject follow request" })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "Follow request rejected successfully" })
    async rejectFollowRequest(@CurrentUser() user: User, @Body() dto: FollowRequestDto): Promise<void> {
        await this.userService.rejectFollowRequest(dto.followerId, user.id);
    }

    @Post("messages/send")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Send message to user" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Message sent successfully" })
    async sendMessage(@CurrentUser() user: User, @Body() dto: SendMessageDto): Promise<any> {
        return this.userService.sendMessage(user.id, dto.receiverId, dto.text);
    }

    @Get("messages/inbox")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get user inbox messages" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Messages retrieved successfully",
        type: MessagesListResponseDto,
    })
    async getInbox(
        @CurrentUser() user: User,
        @Query("page", ParseIntPipe) page: number = 1,
    ): Promise<MessagesListResponseDto> {
        return this.userService.getInbox(user.id, page);
    }

    @Get("messages/sent")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get user sent messages" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Messages retrieved successfully",
        type: MessagesListResponseDto,
    })
    async getSentMessages(
        @CurrentUser() user: User,
        @Query("page", ParseIntPipe) page: number = 1,
    ): Promise<MessagesListResponseDto> {
        return this.userService.getSentMessages(user.id, page);
    }

    @Delete("messages/:messageId")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete a message" })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "Message deleted successfully" })
    async deleteMessage(@CurrentUser() user: User, @Param("messageId", ParseIntPipe) messageId: number): Promise<void> {
        await this.userService.deleteMessage(messageId, user.id);
    }

    @Get("reviews/list")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get user reviews" })
    @ApiResponse({ status: HttpStatus.OK, description: "Reviews retrieved successfully" })
    async getReviews(
        @CurrentUser() user: User,
        @Query("page") page: number = 1,
        @Query("itemType") itemType?: string,
    ): Promise<any> {
        return this.userService.getUserReviews(user.id, Number(page) || 1, itemType);
    }

    @Post("reviews")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Add review for item" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Review added successfully" })
    async addReview(@CurrentUser() user: User, @Body() dto: AddReviewDto): Promise<any> {
        return this.userService.addReview(user.id, dto.itemId, dto.itemType, dto.content, dto.rating);
    }

    @Put("reviews/:itemId")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Update review" })
    @ApiResponse({ status: HttpStatus.OK, description: "Review updated successfully" })
    async updateReview(
        @CurrentUser() user: User,
        @Param("itemId", ParseIntPipe) itemId: number,
        @Body() dto: UpdateReviewDto & { itemType: string },
    ): Promise<any> {
        return this.userService.updateReview(user.id, itemId, dto.itemType, dto.content, dto.rating);
    }

    @Delete("reviews/:itemId")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete review" })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "Review deleted successfully" })
    async removeReview(
        @CurrentUser() user: User,
        @Param("itemId", ParseIntPipe) itemId: number,
        @Body() dto: RemoveReviewDto,
    ): Promise<void> {
        await this.userService.removeReview(user.id, itemId, dto.itemType);
    }

    @Get("forum/topics")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get user's forum topics" })
    @ApiResponse({ status: HttpStatus.OK, description: "Topics retrieved successfully" })
    async getForumTopics(
        @CurrentUser() user: User,
        @Query("page", ParseIntPipe) page: number = 1,
        @Query("search") search: string = "",
        @Query("sortBy") sortBy: string = "createdAt",
        @Query("sortOrder") sortOrder: "asc" | "desc" = "asc",
    ): Promise<any> {
        return this.userService.getUserForumTopics(user.id, page, search, sortBy, sortOrder);
    }

    @Get("forum/replies")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get user's forum replies" })
    @ApiResponse({ status: HttpStatus.OK, description: "Replies retrieved successfully" })
    async getForumReplies(
        @CurrentUser() user: User,
        @Query("page", ParseIntPipe) page: number = 1,
        @Query("search") search: string = "",
        @Query("sortBy") sortBy: string = "createdAt",
        @Query("sortOrder") sortOrder: "asc" | "desc" = "asc",
    ): Promise<any> {
        return this.userService.getUserForumReplies(user.id, page, search, sortBy, sortOrder);
    }
}
