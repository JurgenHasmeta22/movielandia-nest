import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { CrewQueryDto } from "./dtos/crew-query.dto";
import { CreateCrewDto } from "./dtos/create-crew.dto";
import { UpdateCrewDto } from "./dtos/update-crew.dto";
import { CrewListResponseDto, CrewDetailsDto } from "./dtos/crew-response.dto";
import { ICrewRatingInfo } from "./crew.interface";
import { truncateText } from "../../utils/transform.util";

@Injectable()
export class CrewService {
    constructor(private prisma: PrismaService) {}

    async findAll(query: CrewQueryDto, userId?: number): Promise<CrewListResponseDto> {
        try {
            const { sortBy, ascOrDesc = "asc", perPage = 12, page = 1, fullname, role } = query;
            const filters: any = {};

            if (fullname) filters.fullname = { contains: fullname.toLowerCase() };

            if (role) filters.role = { contains: role.toLowerCase() };
            const skip = (page - 1) * perPage;
            const take = perPage;
            const orderByObject: any = { [sortBy || "fullname"]: ascOrDesc };

            const crew = await this.prisma.crew.findMany({
                where: filters,
                orderBy: orderByObject,
                skip,
                take,
            });

            const crewIds = crew.map((c) => c.id);
            const ratingsInfo = await this.getCrewRatings(crewIds);

            const crewWithDetails = await Promise.all(
                crew.map(async (c) => {
                    const bookmarkInfo = userId ? await this.getBookmarkStatus(c.id, userId) : { isBookmarked: false };
                    return this.mapToDetails(c, ratingsInfo[c.id], bookmarkInfo);
                }),
            );

            const totalCount = await this.prisma.crew.count({ where: filters });

            return { crew: crewWithDetails, count: totalCount };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }

            if (error.code === "P2022" || error.code === "P2009") {
                throw new BadRequestException("Invalid query parameters");
            }

            throw error;
        }
    }

    async findOne(id: number, userId?: number): Promise<CrewDetailsDto> {
        const crew = await this.prisma.crew.findFirst({
            where: { id },
            include: {
                producedMovies: { include: { movie: true } },
                producedSeries: { include: { serie: true } },
                reviews: {
                    include: {
                        user: true,
                        upvotes: { select: { user: true } },
                        downvotes: { select: { user: true } },
                        _count: {
                            select: {
                                upvotes: true,
                                downvotes: true,
                            },
                        },
                    },
                },
            },
        });

        if (!crew) {
            throw new NotFoundException("Crew member not found");
        }

        const ratingsInfo = await this.getCrewRatings([crew.id]);
        const bookmarkInfo = userId ? await this.getBookmarkStatus(id, userId) : { isBookmarked: false };

        const reviewInfo = userId ? await this.getReviewStatus(id, userId) : { isReviewed: false };

        return this.mapToDetails(crew, ratingsInfo[crew.id], bookmarkInfo, reviewInfo);
    }

    async search(
        fullname: string,
        userId?: number,
        page: number = 1,
        perPage: number = 12,
    ): Promise<CrewListResponseDto> {
        const skip = (page - 1) * perPage;

        const crew = await this.prisma.crew.findMany({
            where: { fullname: { contains: fullname.toLowerCase() } },
            skip,
            take: perPage,
        });

        const crewIds = crew.map((c) => c.id);
        const ratingsInfo = await this.getCrewRatings(crewIds);

        const crewWithDetails = await Promise.all(
            crew.map(async (c) => {
                const bookmarkInfo = userId ? await this.getBookmarkStatus(c.id, userId) : { isBookmarked: false };
                return this.mapToDetails(c, ratingsInfo[c.id], bookmarkInfo);
            }),
        );

        const count = await this.prisma.crew.count({
            where: { fullname: { contains: fullname.toLowerCase() } },
        });

        return { crew: crewWithDetails, count };
    }

    async create(createCrewDto: CreateCrewDto): Promise<CrewDetailsDto> {
        const crew = await this.prisma.crew.create({
            data: {
                fullname: createCrewDto.fullname.toLowerCase(),
                role: createCrewDto.role.toLowerCase(),
                description: createCrewDto.description,
                photoSrc: createCrewDto.photoSrc,
                photoSrcProd: createCrewDto.photoSrcProd,
                debut: createCrewDto.debut,
            },
        });

        return crew as CrewDetailsDto;
    }

    async update(id: number, updateCrewDto: UpdateCrewDto): Promise<CrewDetailsDto> {
        const crew = await this.prisma.crew.findFirst({
            where: { id },
        });

        if (!crew) {
            throw new NotFoundException("Crew member not found");
        }

        const updatedCrew = await this.prisma.crew.update({
            where: { id },
            data: {
                ...(updateCrewDto.fullname && { fullname: updateCrewDto.fullname.toLowerCase() }),
                ...(updateCrewDto.role && { role: updateCrewDto.role.toLowerCase() }),
                ...(updateCrewDto.description && { description: updateCrewDto.description }),
                ...(updateCrewDto.photoSrc && { photoSrc: updateCrewDto.photoSrc }),
                ...(updateCrewDto.photoSrcProd && { photoSrcProd: updateCrewDto.photoSrcProd }),
                ...(updateCrewDto.debut && { debut: updateCrewDto.debut }),
            },
        });

        return updatedCrew as CrewDetailsDto;
    }

    async remove(id: number): Promise<void> {
        const crew = await this.prisma.crew.findFirst({
            where: { id },
        });

        if (!crew) {
            throw new NotFoundException("Crew member not found");
        }

        await this.prisma.crew.delete({
            where: { id },
        });
    }

    async count(): Promise<number> {
        return this.prisma.crew.count();
    }

    private async getCrewRatings(crewIds: number[]): Promise<{ [key: number]: ICrewRatingInfo }> {
        const crewRatings = await this.prisma.crewReview.groupBy({
            by: ["crewId"],
            where: { crewId: { in: crewIds } },
            _avg: { rating: true },
            _count: { rating: true },
        });

        return crewRatings.reduce((acc, rating) => {
            acc[rating.crewId] = {
                averageRating: rating._avg.rating || 0,
                totalReviews: rating._count.rating,
            };
            return acc;
        }, {});
    }

    private async getBookmarkStatus(crewId: number, userId: number) {
        const existingFavorite = await this.prisma.userCrewFavorite.findFirst({
            where: {
                AND: [{ userId }, { crewId }],
            },
        });

        return { isBookmarked: !!existingFavorite };
    }

    private async getReviewStatus(crewId: number, userId: number) {
        const existingReview = await this.prisma.crewReview.findFirst({
            where: {
                AND: [{ userId }, { crewId }],
            },
        });

        return { isReviewed: !!existingReview };
    }

    private mapToDetails(
        crew: any,
        ratingInfo?: ICrewRatingInfo,
        bookmarkInfo?: { isBookmarked: boolean },
        reviewInfo?: { isReviewed: boolean },
    ): CrewDetailsDto {
        return {
            id: crew.id,
            fullname: crew.fullname,
            role: crew.role,
            description: crew.description ? truncateText(crew.description, 200) : undefined,
            photoSrc: crew.photoSrc,
            photoSrcProd: crew.photoSrcProd,
            debut: crew.debut,
            department: crew.role ?? null,
            movieCredits:
                crew.producedMovies?.map((c: any) => ({
                    id: c.movie.id,
                    title: c.movie.title,
                    photoSrc: c.movie.photoSrc ?? null,
                })) ?? [],
            serieCredits:
                crew.producedSeries?.map((c: any) => ({
                    id: c.serie.id,
                    title: c.serie.title,
                    photoSrc: c.serie.photoSrc ?? null,
                })) ?? [],
            ratings: ratingInfo
                ? { averageRating: ratingInfo.averageRating, totalReviews: ratingInfo.totalReviews }
                : undefined,
            isBookmarked: bookmarkInfo?.isBookmarked || false,
            isReviewed: reviewInfo?.isReviewed || false,
            reviews: crew.reviews?.map((review: any) => ({
                id: review.id,
                rating: review.rating,
                content: review.content,
                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
                user: { id: review.user.id, userName: review.user.userName, avatar: review.user.avatar },
                isUpvoted: review.upvotes?.some((v: any) => v.user?.id === bookmarkInfo?.isBookmarked) || false,
                isDownvoted: review.downvotes?.some((v: any) => v.user?.id === bookmarkInfo?.isBookmarked) || false,
                _count: review._count,
            })),
        };
    }
}
