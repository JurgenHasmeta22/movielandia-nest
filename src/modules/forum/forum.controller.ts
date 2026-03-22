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
import { ForumService } from "./forum.service";
import { CreateForumCategoryDto, UpdateForumCategoryDto } from "./dtos/forum-category.dto";
import { CreateForumTopicDto, UpdateForumTopicDto } from "./dtos/forum-topic.dto";
import { CreateForumPostDto, UpdateForumPostDto } from "./dtos/forum-post.dto";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { Request, Response } from "express";

@Controller("forum")
export class ForumController {
    constructor(private readonly forumService: ForumService) {}

    // ─── Categories ────────────────────────────────────────────────────────────

    @Get()
    @Inertia("Forum/Index")
    async index() {
        const categories = await this.forumService.findAllCategories();
        return { categories };
    }

    @Get("categories/:id")
    @Inertia("Forum/Category")
    async category(@Param("id", ParseIntPipe) id: number, @Query("page") page = 1, @Query("perPage") perPage = 20) {
        const [category, topics] = await Promise.all([
            this.forumService.findCategoryById(id),
            this.forumService.findTopicsByCategory(id, Number(page), Number(perPage)),
        ]);
        return { category, topics };
    }

    @Post("categories")
    @UseGuards(AuthGuard)
    async createCategory(@Body() dto: CreateForumCategoryDto, @Req() req: Request, @Res() res: Response) {
        await this.forumService.createCategory(dto);
        (req.session as any).flash = { type: "success", message: "Category created." };
        return res.redirect(303, "/forum");
    }

    @Put("categories/:id")
    @UseGuards(AuthGuard)
    async updateCategory(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: UpdateForumCategoryDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.forumService.updateCategory(id, dto);
        (req.session as any).flash = { type: "success", message: "Category updated." };
        return res.redirect(303, `/forum/categories/${id}`);
    }

    @Delete("categories/:id")
    @UseGuards(AuthGuard)
    async deleteCategory(@Param("id", ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
        await this.forumService.deleteCategory(id);
        (req.session as any).flash = { type: "success", message: "Category deleted." };
        return res.redirect(303, "/forum");
    }

    // ─── Topics ────────────────────────────────────────────────────────────────

    @Get("topics/:id")
    @Inertia("Forum/Topic")
    async topic(@Param("id", ParseIntPipe) id: number, @Query("page") page = 1, @Query("perPage") perPage = 20) {
        await this.forumService.incrementViewCount(id);
        const [topic, posts] = await Promise.all([
            this.forumService.findTopicById(id),
            this.forumService.findPostsByTopic(id, Number(page), Number(perPage)),
        ]);
        return { topic, posts };
    }

    @Post("topics")
    @UseGuards(AuthGuard)
    async createTopic(@Body() dto: CreateForumTopicDto, @Req() req: Request, @Res() res: Response) {
        const topic = await this.forumService.createTopic(req.session!.userId!, dto);
        (req.session as any).flash = { type: "success", message: "Topic created." };
        return res.redirect(303, `/forum/topics/${(topic as any).id}`);
    }

    @Put("topics/:id")
    @UseGuards(AuthGuard)
    async updateTopic(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: UpdateForumTopicDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.forumService.updateTopic(id, dto);
        (req.session as any).flash = { type: "success", message: "Topic updated." };
        return res.redirect(303, `/forum/topics/${id}`);
    }

    @Delete("topics/:id")
    @UseGuards(AuthGuard)
    async deleteTopic(@Param("id", ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
        await this.forumService.deleteTopic(id);
        (req.session as any).flash = { type: "success", message: "Topic deleted." };
        return res.redirect(303, "/forum");
    }

    // ─── Posts ─────────────────────────────────────────────────────────────────

    @Post("posts")
    @UseGuards(AuthGuard)
    async createPost(@Body() dto: CreateForumPostDto, @Req() req: Request, @Res() res: Response) {
        await this.forumService.createPost(req.session!.userId!, dto);
        (req.session as any).flash = { type: "success", message: "Reply posted." };
        return res.redirect(303, `/forum/topics/${(dto as any).topicId}`);
    }

    @Put("posts/:id")
    @UseGuards(AuthGuard)
    async updatePost(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: UpdateForumPostDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const post = await this.forumService.updatePost(id, dto);
        (req.session as any).flash = { type: "success", message: "Post updated." };
        return res.redirect(303, `/forum/topics/${(post as any).topicId}`);
    }

    @Delete("posts/:id")
    @UseGuards(AuthGuard)
    async deletePost(@Param("id", ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
        await this.forumService.deletePost(id);
        (req.session as any).flash = { type: "success", message: "Post deleted." };
        return res.redirect(303, "/forum");
    }
}
