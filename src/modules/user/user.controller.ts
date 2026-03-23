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
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { Inertia } from "inertia-nestjs";
import { UserService } from "./user.service";
import {
    UserQueryDto,
    AddFavoriteDto,
    RemoveFavoriteDto,
    GetFavoritesQueryDto,
    FollowDto,
    UnfollowDto,
    FollowRequestDto,
    SendMessageDto,
    AddReviewDto,
    UpdateReviewDto,
    RemoveReviewDto,
} from "./dtos/user.dto";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { Request, Response } from "express";

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @Inertia("Users/Index")
    async index(@Query() query: UserQueryDto) {
        const data = await this.userService.getUsersWithFilters(query);
        return { users: data.users };
    }

    @Get("me")
    @UseGuards(AuthGuard)
    @Inertia("Users/Profile")
    async profile(@Req() req: Request) {
        const user = await this.userService.getUserById(req.session!.userId!);
        return { user, isOwnProfile: true };
    }

    @Get("favorites/list")
    @UseGuards(AuthGuard)
    @Inertia("Users/Favorites")
    async favorites(@Req() req: Request, @Query() query: GetFavoritesQueryDto) {
        const data = await this.userService.getFavorites(
            req.session!.userId!,
            query.type,
            query.page || 1,
            query.search || "",
        );
        return { favorites: data, type: query.type };
    }

    @Get("messages/inbox")
    @UseGuards(AuthGuard)
    @Inertia("Users/Messages")
    async inbox(@Req() req: Request, @Query("page") page = 1) {
        const messages = await this.userService.getInbox(req.session!.userId!, Number(page));
        return { messages, box: "inbox" };
    }

    @Get("messages/sent")
    @UseGuards(AuthGuard)
    @Inertia("Users/Messages")
    async sent(@Req() req: Request, @Query("page") page = 1) {
        const messages = await this.userService.getSentMessages(req.session!.userId!, Number(page));
        return { messages, box: "sent" };
    }

    @Get("reviews/list")
    @UseGuards(AuthGuard)
    @Inertia("Users/Reviews")
    async reviews(@Req() req: Request, @Query("page") page = 1, @Query("itemType") itemType?: string) {
        const reviews = await this.userService.getUserReviews(req.session!.userId!, Number(page) || 1, itemType);
        return { reviews };
    }

    @Get("forum/topics")
    @UseGuards(AuthGuard)
    @Inertia("Users/ForumTopics")
    async forumTopics(
        @Req() req: Request,
        @Query("page") page = 1,
        @Query("search") search = "",
        @Query("sortBy") sortBy = "createdAt",
        @Query("sortOrder") sortOrder: "asc" | "desc" = "asc",
    ) {
        const data = await this.userService.getUserForumTopics(
            req.session!.userId!,
            Number(page),
            search,
            sortBy,
            sortOrder,
        );
        return { topics: data };
    }

    @Get(":id")
    @Inertia("Users/Show")
    async show(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
        const user = await this.userService.getUserById(id);
        const isOwnProfile = req.session?.userId === id;
        return { user, isOwnProfile };
    }

    // ─── Favorites ──────────────────────────────────────────────────────────────

    @Post("favorites")
    @UseGuards(AuthGuard)
    async addFavorite(@Body() dto: AddFavoriteDto, @Req() req: Request, @Res() res: Response) {
        try {
            await this.userService.addFavorite(req.session!.userId!, dto.itemId, dto.type);
            (req.session as any).flash = { type: "success", message: "Added to favorites!" };
        } catch {
            (req.session as any).flash = { type: "error", message: "Already in your favorites." };
        }
        return res.redirect(303, req.headers.referer || "/");
    }

    @Delete("favorites")
    @UseGuards(AuthGuard)
    async removeFavorite(@Body() dto: RemoveFavoriteDto, @Req() req: Request, @Res() res: Response) {
        try {
            await this.userService.removeFavorite(req.session!.userId!, dto.itemId, dto.type);
            (req.session as any).flash = { type: "success", message: "Removed from favorites." };
        } catch {
            (req.session as any).flash = { type: "error", message: "Favorite not found." };
        }
        return res.redirect(303, req.headers.referer || "/");
    }

    // ─── Follow ─────────────────────────────────────────────────────────────────

    @Post("follow")
    @UseGuards(AuthGuard)
    async follow(@Body() dto: FollowDto, @Req() req: Request, @Res() res: Response) {
        await this.userService.follow(req.session!.userId!, dto.followingId);
        return res.redirect(303, `/users/${dto.followingId}`);
    }

    @Post("unfollow")
    @UseGuards(AuthGuard)
    async unfollow(@Body() dto: UnfollowDto, @Req() req: Request, @Res() res: Response) {
        await this.userService.unfollow(req.session!.userId!, dto.followingId);
        return res.redirect(303, `/users/${dto.followingId}`);
    }

    @Post("follow-requests/accept")
    @UseGuards(AuthGuard)
    async acceptFollow(@Body() dto: FollowRequestDto, @Req() req: Request, @Res() res: Response) {
        await this.userService.acceptFollowRequest(dto.followerId, req.session!.userId!);
        return res.redirect(303, "/users/me");
    }

    @Post("follow-requests/reject")
    @UseGuards(AuthGuard)
    async rejectFollow(@Body() dto: FollowRequestDto, @Req() req: Request, @Res() res: Response) {
        await this.userService.rejectFollowRequest(dto.followerId, req.session!.userId!);
        return res.redirect(303, "/users/me");
    }

    // ─── Messages ───────────────────────────────────────────────────────────────

    @Post("messages/send")
    @UseGuards(AuthGuard)
    async sendMessage(@Body() dto: SendMessageDto, @Req() req: Request, @Res() res: Response) {
        await this.userService.sendMessage(req.session!.userId!, dto.receiverId, dto.text);
        (req.session as any).flash = { type: "success", message: "Message sent." };
        return res.redirect(303, "/users/messages/sent");
    }

    @Delete("messages/:messageId")
    @UseGuards(AuthGuard)
    async deleteMessage(
        @Param("messageId", ParseIntPipe) messageId: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.userService.deleteMessage(messageId, req.session!.userId!);
        return res.redirect(303, "/users/messages/inbox");
    }

    // ─── Reviews ────────────────────────────────────────────────────────────────

    @Post("reviews")
    @UseGuards(AuthGuard)
    async addReview(@Body() dto: AddReviewDto, @Req() req: Request, @Res() res: Response) {
        await this.userService.addReview(req.session!.userId!, dto.itemId, dto.itemType, dto.content, dto.rating);
        (req.session as any).flash = { type: "success", message: "Review added." };
        return res.redirect(303, req.headers.referer || "/");
    }

    @Put("reviews/:itemId")
    @UseGuards(AuthGuard)
    async updateReview(
        @Param("itemId", ParseIntPipe) itemId: number,
        @Body() dto: UpdateReviewDto & { itemType: string },
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.userService.updateReview(req.session!.userId!, itemId, dto.itemType, dto.content, dto.rating);
        (req.session as any).flash = { type: "success", message: "Review updated." };
        return res.redirect(303, req.headers.referer || "/");
    }

    @Delete("reviews/:itemId")
    @UseGuards(AuthGuard)
    async removeReview(
        @Param("itemId", ParseIntPipe) itemId: number,
        @Body() dto: RemoveReviewDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.userService.removeReview(req.session!.userId!, itemId, dto.itemType);
        (req.session as any).flash = { type: "success", message: "Review deleted." };
        return res.redirect(303, req.headers.referer || "/");
    }
}
