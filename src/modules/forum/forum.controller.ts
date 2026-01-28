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
    UseGuards,
    ValidationPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { ForumService } from "./forum.service";
import { CreateForumCategoryDto, UpdateForumCategoryDto, ForumCategoryDto } from "./dtos/forum-category.dto";
import { CreateForumTopicDto, UpdateForumTopicDto, ForumTopicDto } from "./dtos/forum-topic.dto";
import { CreateForumPostDto, UpdateForumPostDto, ForumPostDto, ForumPostResponseDto } from "./dtos/forum-post.dto";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { OptionalAuthGuard } from "../../auth/guards/optional-auth.guard";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { User } from "@prisma/client";

@ApiTags("Forum")
@Controller("forum")
@UseGuards(OptionalAuthGuard)
export class ForumController {
    constructor(private readonly forumService: ForumService) {}

    @Get("categories")
    @ApiOperation({ summary: "Get all forum categories" })
    @ApiResponse({ status: HttpStatus.OK, description: "Categories retrieved successfully", type: [ForumCategoryDto] })
    async findAllCategories() {
        return this.forumService.findAllCategories();
    }

    @Get("categories/:id")
    @ApiOperation({ summary: "Get forum category by id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Category retrieved successfully", type: ForumCategoryDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Category not found" })
    async findCategoryById(@Param("id", ParseIntPipe) id: number) {
        return this.forumService.findCategoryById(id);
    }

    @Post("categories")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Create a new forum category" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Category created successfully", type: ForumCategoryDto })
    async createCategory(@Body() createForumCategoryDto: CreateForumCategoryDto) {
        return this.forumService.createCategory(createForumCategoryDto);
    }

    @Put("categories/:id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Update a forum category" })
    @ApiResponse({ status: HttpStatus.OK, description: "Category updated successfully", type: ForumCategoryDto })
    async updateCategory(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateForumCategoryDto: UpdateForumCategoryDto,
    ) {
        return this.forumService.updateCategory(id, updateForumCategoryDto);
    }

    @Delete("categories/:id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Delete a forum category" })
    @ApiResponse({ status: HttpStatus.OK, description: "Category deleted successfully" })
    async deleteCategory(@Param("id", ParseIntPipe) id: number) {
        return this.forumService.deleteCategory(id);
    }

    @Get("topics/:id")
    @ApiOperation({ summary: "Get forum topic by id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Topic retrieved successfully", type: ForumTopicDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Topic not found" })
    async findTopicById(@Param("id", ParseIntPipe) id: number) {
        await this.forumService.incrementViewCount(id);
        return this.forumService.findTopicById(id);
    }

    @Get("categories/:categoryId/topics")
    @ApiOperation({ summary: "Get topics by category" })
    @ApiResponse({ status: HttpStatus.OK, description: "Topics retrieved successfully" })
    async findTopicsByCategory(
        @Param("categoryId", ParseIntPipe) categoryId: number,
        @Query("page", ParseIntPipe) page: number = 1,
        @Query("perPage", ParseIntPipe) perPage: number = 20,
    ) {
        return this.forumService.findTopicsByCategory(categoryId, page, perPage);
    }

    @Post("topics")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Create a new forum topic" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Topic created successfully", type: ForumTopicDto })
    async createTopic(@CurrentUser() user: User, @Body() createForumTopicDto: CreateForumTopicDto) {
        return this.forumService.createTopic(user.id, createForumTopicDto);
    }

    @Put("topics/:id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Update a forum topic" })
    @ApiResponse({ status: HttpStatus.OK, description: "Topic updated successfully", type: ForumTopicDto })
    async updateTopic(@Param("id", ParseIntPipe) id: number, @Body() updateForumTopicDto: UpdateForumTopicDto) {
        return this.forumService.updateTopic(id, updateForumTopicDto);
    }

    @Delete("topics/:id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Delete a forum topic" })
    @ApiResponse({ status: HttpStatus.OK, description: "Topic deleted successfully" })
    async deleteTopic(@Param("id", ParseIntPipe) id: number) {
        return this.forumService.deleteTopic(id);
    }

    @Get("posts/:id")
    @ApiOperation({ summary: "Get forum post by id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Post retrieved successfully", type: ForumPostDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Post not found" })
    async findPostById(@Param("id", ParseIntPipe) id: number) {
        return this.forumService.findPostById(id);
    }

    @Get("topics/:topicId/posts")
    @ApiOperation({ summary: "Get posts by topic" })
    @ApiResponse({ status: HttpStatus.OK, description: "Posts retrieved successfully", type: ForumPostResponseDto })
    async findPostsByTopic(
        @Param("topicId", ParseIntPipe) topicId: number,
        @Query("page", ParseIntPipe) page: number = 1,
        @Query("perPage", ParseIntPipe) perPage: number = 20,
    ) {
        return this.forumService.findPostsByTopic(topicId, page, perPage);
    }

    @Post("posts")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Create a new forum post" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Post created successfully", type: ForumPostDto })
    async createPost(@CurrentUser() user: User, @Body() createForumPostDto: CreateForumPostDto) {
        return this.forumService.createPost(user.id, createForumPostDto);
    }

    @Put("posts/:id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Update a forum post" })
    @ApiResponse({ status: HttpStatus.OK, description: "Post updated successfully", type: ForumPostDto })
    async updatePost(@Param("id", ParseIntPipe) id: number, @Body() updateForumPostDto: UpdateForumPostDto) {
        return this.forumService.updatePost(id, updateForumPostDto);
    }

    @Delete("posts/:id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Delete a forum post" })
    @ApiResponse({ status: HttpStatus.OK, description: "Post deleted successfully" })
    async deletePost(@Param("id", ParseIntPipe) id: number) {
        return this.forumService.deletePost(id);
    }
}
