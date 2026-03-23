// #region "Imports"
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";
import { genres } from "./data/genres";
import { users as baseUsers } from "./data/users";
import { forumCategories } from "./data/forumData";
import { forumTags } from "./data/forumTagData";
// #endregion

// #region "Config"
const MOVIES_COUNT = 300;
const SERIES_COUNT = 90;
const SEASONS_PER_SERIE = 2;
const EPISODES_PER_SEASON = 5;
const ACTORS_COUNT = 180;
const CREW_COUNT = 120;

const dbPath = process.env.DATABASE_URL || "file:./prisma/database/movielandia24.db";
const adapter = new PrismaLibSql({ url: dbPath });
const prisma = new PrismaClient({
    adapter,
    log: ["info", "warn", "error"],
});
// #endregion

// #region "Helpers"
function randomRating(): number {
    return Number((Math.random() * (9.9 - 1.0) + 1.0).toFixed(1));
}

function randomDate(): Date {
    const start = new Date(1950, 0, 1).getTime();
    const end = new Date().getTime();
    return new Date(Math.floor(Math.random() * (end - start) + start));
}

function randomDuration(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const TRAILER_IDS = [
    "D8La5G1DzCM", "7GdM7gZ1ip4", "BJYJksHREIc", "_Z3QKkl1WyM",
    "dQw4w9WgXcQ", "6ZfuNTqbHE8", "jEDaVHmw7r4", "g4Hbz2jLxvQ",
    "TcMBFSGVi1c", "8Qn_spdM5Zg", "5PSNL1qE6VY", "FB5cYwBYKTQ",
];

function randomTrailer(): string {
    return `https://www.youtube.com/embed/${faker.helpers.arrayElement(TRAILER_IDS)}`;
}

function photoSrc(local = true): string {
    return local
        ? `http://localhost:4000/images/placeholder.jpg`
        : `https://movielandia-avenger22s-projects.vercel.app/images/placeholder.jpg`;
}

function pickRandom<T>(arr: T[], count: number): T[] {
    return faker.helpers.arrayElements(arr, Math.min(count, arr.length));
}

function randomMovieTitle(): string {
    const styles = [
        () => `${faker.word.adjective()} ${faker.word.noun()}`,
        () => `The ${faker.word.noun()} of ${faker.word.noun()}`,
        () => `${faker.person.lastName()}'s ${faker.word.noun()}`,
        () => `${faker.word.adjective()} ${faker.word.adjective()} ${faker.word.noun()}`,
        () => faker.lorem.words(faker.number.int({ min: 1, max: 4 })),
    ];
    return faker.helpers.arrayElement(styles)();
}

function uniqueSlug(base: string, counter: number): string {
    return `${base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${counter}-${Date.now()}`;
}
// #endregion

// #region "Seed Users"
async function seedUsers(): Promise<{ id: number }[]> {
    console.log("Seeding users...");
    const created: { id: number }[] = [];

    for (const u of baseUsers) {
        const hashed = await bcrypt.hash(u.password, 10);
        const user = await prisma.user.create({
            data: {
                userName: u.userName,
                email: u.email,
                password: hashed,
                role: u.role as any,
                bio: u.bio,
                active: u.active,
            },
        });
        created.push({ id: user.id });
    }

    console.log(`Created ${created.length} users.`);
    return created;
}
// #endregion

// #region "Seed Genres"
async function seedGenres(): Promise<{ id: number }[]> {
    console.log("Seeding genres...");

    for (const g of genres) {
        await prisma.genre.create({ data: g });
    }

    const all = await prisma.genre.findMany({ select: { id: true } });
    console.log(`Created ${all.length} genres.`);
    return all;
}
// #endregion

// #region "Seed Actors"
async function seedActors(count: number): Promise<{ id: number }[]> {
    console.log(`Seeding ${count} actors...`);
    const batch = [];

    for (let i = 0; i < count; i++) {
        batch.push({
            fullname: faker.person.fullName(),
            photoSrc: photoSrc(true),
            photoSrcProd: photoSrc(false),
            description: faker.lorem.paragraph(),
            debut: faker.date.between({ from: "1970-01-01", to: "2015-01-01" }).getFullYear().toString(),
        });
    }

    for (let i = 0; i < batch.length; i += 10) {
        await Promise.all(batch.slice(i, i + 10).map((a) => prisma.actor.create({ data: a })));
    }

    const all = await prisma.actor.findMany({ select: { id: true } });
    console.log(`Created ${all.length} actors.`);
    return all;
}
// #endregion

// #region "Seed Crew"
const CREW_ROLES = [
    "Director", "Producer", "Screenwriter", "Cinematographer",
    "Film Editor", "Production Designer", "Costume Designer",
    "Music Composer", "Sound Designer", "Visual Effects Supervisor",
];

async function seedCrew(count: number): Promise<{ id: number }[]> {
    console.log(`Seeding ${count} crew members...`);
    const batch = [];

    for (let i = 0; i < count; i++) {
        batch.push({
            fullname: faker.person.fullName(),
            photoSrc: photoSrc(true),
            photoSrcProd: photoSrc(false),
            description: faker.lorem.paragraph(),
            debut: faker.date.between({ from: "1970-01-01", to: "2015-01-01" }).getFullYear().toString(),
            role: faker.helpers.arrayElement(CREW_ROLES),
        });
    }

    for (let i = 0; i < batch.length; i += 10) {
        await Promise.all(batch.slice(i, i + 10).map((c) => prisma.crew.create({ data: c })));
    }

    const all = await prisma.crew.findMany({ select: { id: true } });
    console.log(`Created ${all.length} crew members.`);
    return all;
}
// #endregion

// #region "Seed Movies"
async function seedMovies(
    count: number,
    genreIds: number[],
    actorIds: number[],
    crewIds: number[],
    userIds: number[],
): Promise<void> {
    console.log(`Seeding ${count} movies...`);

    for (let i = 0; i < count; i++) {
        const movie = await prisma.movie.create({
            data: {
                title: randomMovieTitle(),
                photoSrc: photoSrc(true),
                photoSrcProd: photoSrc(false),
                trailerSrc: randomTrailer(),
                duration: randomDuration(75, 200),
                dateAired: randomDate(),
                ratingImdb: randomRating(),
                description: faker.lorem.paragraphs(2),
            },
        });

        // Genres (1-3)
        const movieGenreIds = pickRandom(genreIds, randomDuration(1, 3));
        await Promise.all(
            movieGenreIds.map((genreId) => prisma.movieGenre.create({ data: { movieId: movie.id, genreId } })),
        );

        // Cast (3-6 actors)
        const castActorIds = new Set(pickRandom(actorIds, randomDuration(3, 6)));
        await Promise.all(
            [...castActorIds].map((actorId) => prisma.castMovie.create({ data: { movieId: movie.id, actorId } })),
        );

        // Crew (2-4 members)
        const castCrewIds = new Set(pickRandom(crewIds, randomDuration(2, 4)));
        await Promise.all(
            [...castCrewIds].map((crewId) => prisma.crewMovie.create({ data: { movieId: movie.id, crewId } })),
        );

        // Reviews + votes (1-3 reviews)
        const reviewerCount = randomDuration(1, 3);
        const reviewers = pickRandom(userIds, reviewerCount);

        for (const userId of reviewers) {
            const review = await prisma.movieReview.create({
                data: {
                    userId,
                    movieId: movie.id,
                    content: faker.lorem.paragraph(),
                    rating: randomRating(),
                },
            });

            const nonReviewers = userIds.filter((id) => id !== userId);
            const upvoters = pickRandom(nonReviewers, randomDuration(0, 3));
            await Promise.all(
                upvoters.map((uid) =>
                    prisma.upvoteMovieReview.create({ data: { userId: uid, movieId: movie.id, movieReviewId: review.id } }),
                ),
            );

            const remaining = nonReviewers.filter((id) => !upvoters.includes(id));
            const downvoters = pickRandom(remaining, randomDuration(0, 2));
            await Promise.all(
                downvoters.map((uid) =>
                    prisma.downvoteMovieReview.create({ data: { userId: uid, movieId: movie.id, movieReviewId: review.id } }),
                ),
            );
        }

        // Ratings + favorites
        const raterPool = userIds.filter((id) => !reviewers.includes(id));
        const raters = pickRandom(raterPool, randomDuration(2, 5));
        const ratedSet = new Set<number>();

        for (const userId of raters) {
            if (ratedSet.has(userId)) continue;
            ratedSet.add(userId);

            await prisma.userMovieRating.create({ data: { userId, movieId: movie.id, rating: randomRating() } });

            if (Math.random() > 0.55) {
                await prisma.userMovieFavorite.create({ data: { userId, movieId: movie.id } }).catch(() => {});
            }
        }

        if ((i + 1) % 20 === 0) console.log(`  Movies seeded: ${i + 1}/${count}`);
    }

    console.log(`Finished seeding ${count} movies.`);
}
// #endregion

// #region "Seed Series"
async function seedSeries(
    count: number,
    seasonsPerSerie: number,
    episodesPerSeason: number,
    genreIds: number[],
    actorIds: number[],
    crewIds: number[],
    userIds: number[],
): Promise<void> {
    console.log(`Seeding ${count} series (${seasonsPerSerie} seasons × ${episodesPerSeason} episodes each)...`);

    for (let s = 0; s < count; s++) {
        const serieTitle = randomMovieTitle();

        const serie = await prisma.serie.create({
            data: {
                title: serieTitle,
                photoSrc: photoSrc(true),
                photoSrcProd: photoSrc(false),
                trailerSrc: randomTrailer(),
                description: faker.lorem.paragraphs(2),
                dateAired: randomDate(),
                ratingImdb: randomRating(),
            },
        });

        // Genres (1-3)
        const sGenreIds = pickRandom(genreIds, randomDuration(1, 3));
        await Promise.all(
            sGenreIds.map((genreId) => prisma.serieGenre.create({ data: { serieId: serie.id, genreId } })),
        );

        // Cast (3-6 actors)
        const castActorIds = new Set(pickRandom(actorIds, randomDuration(3, 6)));
        await Promise.all(
            [...castActorIds].map((actorId) => prisma.castSerie.create({ data: { serieId: serie.id, actorId } })),
        );

        // Crew (2-4 members)
        const castCrewIds = new Set(pickRandom(crewIds, randomDuration(2, 4)));
        await Promise.all(
            [...castCrewIds].map((crewId) => prisma.crewSerie.create({ data: { serieId: serie.id, crewId } })),
        );

        // Serie reviews + votes
        const serieReviewers = pickRandom(userIds, randomDuration(1, 3));
        for (const userId of serieReviewers) {
            const review = await prisma.serieReview.create({
                data: { userId, serieId: serie.id, content: faker.lorem.paragraph(), rating: randomRating() },
            });

            const others = userIds.filter((id) => id !== userId);
            await Promise.all(
                pickRandom(others, randomDuration(0, 3)).map((uid) =>
                    prisma.upvoteSerieReview.create({ data: { userId: uid, serieId: serie.id, serieReviewId: review.id } }),
                ),
            );
        }

        // Serie ratings + favorites
        const serieRaters = pickRandom(userIds.filter((id) => !serieReviewers.includes(id)), randomDuration(2, 5));
        for (const userId of serieRaters) {
            await prisma.userSerieRating.create({ data: { userId, serieId: serie.id, rating: randomRating() } }).catch(() => {});
            if (Math.random() > 0.55) {
                await prisma.userSerieFavorite.create({ data: { userId, serieId: serie.id } }).catch(() => {});
            }
        }

        // Seasons
        for (let sn = 0; sn < seasonsPerSerie; sn++) {
            const season = await prisma.season.create({
                data: {
                    title: `${serieTitle} Season ${sn + 1}`,
                    photoSrc: photoSrc(true),
                    photoSrcProd: photoSrc(false),
                    trailerSrc: randomTrailer(),
                    description: `Season ${sn + 1} of ${serieTitle}. ${faker.lorem.paragraph()}`,
                    dateAired: randomDate(),
                    ratingImdb: randomRating(),
                    serieId: serie.id,
                },
            });

            // Season reviews + votes
            const seasonReviewers = pickRandom(userIds, randomDuration(1, 2));
            for (const userId of seasonReviewers) {
                const review = await prisma.seasonReview.create({
                    data: { userId, seasonId: season.id, content: faker.lorem.paragraph(), rating: randomRating() },
                });

                await Promise.all(
                    pickRandom(userIds.filter((id) => id !== userId), randomDuration(0, 3)).map((uid) =>
                        prisma.upvoteSeasonReview
                            .create({ data: { userId: uid, seasonId: season.id, seasonReviewId: review.id } })
                            .catch(() => {}),
                    ),
                );
            }

            // Season ratings + favorites
            for (const userId of pickRandom(userIds, randomDuration(1, 4))) {
                await prisma.userSeasonRating.create({ data: { userId, seasonId: season.id, rating: randomRating() } }).catch(() => {});
                if (Math.random() > 0.6) {
                    await prisma.userSeasonFavorite.create({ data: { userId, seasonId: season.id } }).catch(() => {});
                }
            }

            // Episodes
            for (let ep = 0; ep < episodesPerSeason; ep++) {
                const episode = await prisma.episode.create({
                    data: {
                        title: `${serieTitle} S${sn + 1}E${ep + 1}`,
                        photoSrc: photoSrc(true),
                        photoSrcProd: photoSrc(false),
                        trailerSrc: randomTrailer(),
                        duration: randomDuration(20, 65),
                        description: `Episode ${ep + 1} of season ${sn + 1}. ${faker.lorem.paragraph()}`,
                        dateAired: randomDate(),
                        ratingImdb: randomRating(),
                        seasonId: season.id,
                    },
                });

                // Episode reviews + votes
                const epReviewers = pickRandom(userIds, randomDuration(0, 2));
                for (const userId of epReviewers) {
                    const review = await prisma.episodeReview.create({
                        data: { userId, episodeId: episode.id, content: faker.lorem.paragraph(), rating: randomRating() },
                    });

                    await Promise.all(
                        pickRandom(userIds.filter((id) => id !== userId), randomDuration(0, 2)).map((uid) =>
                            prisma.upvoteEpisodeReview
                                .create({ data: { userId: uid, episodeId: episode.id, episodeReviewId: review.id } })
                                .catch(() => {}),
                        ),
                    );
                }

                // Episode ratings + favorites
                for (const userId of pickRandom(userIds, randomDuration(1, 3))) {
                    await prisma.userEpisodeRating.create({ data: { userId, episodeId: episode.id, rating: randomRating() } }).catch(() => {});
                    if (Math.random() > 0.65) {
                        await prisma.userEpisodeFavorite.create({ data: { userId, episodeId: episode.id } }).catch(() => {});
                    }
                }
            }
        }

        if ((s + 1) % 10 === 0) console.log(`  Series seeded: ${s + 1}/${count}`);
    }

    console.log(`Finished seeding ${count} series.`);
}
// #endregion

// #region "Seed Forum"
async function seedForum(userIds: number[]): Promise<void> {
    console.log("Seeding forum data...");

    // Categories
    const existingCatCount = await prisma.forumCategory.count();
    if (existingCatCount === 0) {
        for (const cat of forumCategories) {
            await prisma.forumCategory.create({ data: cat });
        }
        console.log(`Created ${forumCategories.length} forum categories.`);
    }

    // Tags
    const existingTagCount = await prisma.forumTag.count();
    if (existingTagCount === 0) {
        for (const tag of forumTags) {
            await prisma.forumTag.create({ data: tag });
        }
        console.log(`Created ${forumTags.length} forum tags.`);
    }

    const categories = await prisma.forumCategory.findMany();
    const tags = await prisma.forumTag.findMany({ select: { id: true } });
    let topicSlugCounter = 0;
    let postSlugCounter = 0;

    for (const category of categories) {
        const topicCount = randomDuration(5, 12);

        for (let t = 0; t < topicCount; t++) {
            topicSlugCounter++;
            const userId = faker.helpers.arrayElement(userIds);
            const title = faker.lorem.sentence().replace(/\.$/, "");
            const slug = uniqueSlug(title, topicSlugCounter);
            const content = `<p>${faker.lorem.paragraphs(3).replace(/\n/g, "</p><p>")}</p>`;

            const topic = await prisma.forumTopic.create({
                data: {
                    title,
                    content,
                    slug,
                    isPinned: Math.random() < 0.15,
                    isLocked: Math.random() < 0.08,
                    viewCount: randomDuration(5, 500),
                    categoryId: category.id,
                    userId,
                },
            });

            // Assign 1-3 tags to this topic
            const topicTagIds = pickRandom(tags.map((t) => t.id), randomDuration(1, 3));
            await prisma.forumTopic.update({
                where: { id: topic.id },
                data: { tags: { connect: topicTagIds.map((id) => ({ id })) } },
            });

            // Topic upvotes
            await Promise.all(
                pickRandom(userIds.filter((id) => id !== userId), randomDuration(0, 4)).map((uid) =>
                    prisma.upvoteForumTopic.create({ data: { userId: uid, topicId: topic.id } }).catch(() => {}),
                ),
            );

            // Posts
            const postCount = randomDuration(2, 18);
            let lastPostAt: Date | null = null;

            for (let p = 0; p < postCount; p++) {
                postSlugCounter++;
                const postUserId = faker.helpers.arrayElement(userIds);
                const postContent = `<p>${faker.lorem.paragraphs(2).replace(/\n/g, "</p><p>")}</p>`;

                const post = await prisma.forumPost.create({
                    data: {
                        content: postContent,
                        slug: `post-${postSlugCounter}-${Date.now()}`,
                        isEdited: Math.random() < 0.25,
                        topicId: topic.id,
                        userId: postUserId,
                    },
                });

                lastPostAt = post.createdAt;

                // Post upvotes
                const postUpvoters = pickRandom(userIds.filter((id) => id !== postUserId), randomDuration(0, 5));
                await Promise.all(
                    postUpvoters.map((uid) =>
                        prisma.upvoteForumPost.create({ data: { userId: uid, postId: post.id } }).catch(() => {}),
                    ),
                );

                // Replies (40% chance per post)
                if (Math.random() < 0.4) {
                    const replyCount = randomDuration(1, 4);

                    for (let r = 0; r < replyCount; r++) {
                        const replyUserId = faker.helpers.arrayElement(userIds);

                        const reply = await prisma.forumReply.create({
                            data: {
                                content: `<p>${faker.lorem.paragraph()}</p>`,
                                postId: post.id,
                                userId: replyUserId,
                            },
                        });

                        // Reply upvotes
                        await Promise.all(
                            pickRandom(userIds.filter((id) => id !== replyUserId), randomDuration(0, 3)).map((uid) =>
                                prisma.upvoteForumReply.create({ data: { userId: uid, replyId: reply.id } }).catch(() => {}),
                            ),
                        );
                    }
                }
            }

            // Update topic lastPostAt and category counters
            if (lastPostAt) {
                await prisma.forumTopic.update({
                    where: { id: topic.id },
                    data: { lastPostAt },
                });
            }

            await prisma.forumCategory.update({
                where: { id: category.id },
                data: {
                    topicCount: { increment: 1 },
                    postCount: { increment: postCount },
                    lastPostAt: new Date(),
                },
            });
        }
    }

    // ForumUserStats
    console.log("Updating forum user stats...");

    for (const userId of userIds) {
        const [topicCount, postCount, replyCount, upvotesReceived] = await Promise.all([
            prisma.forumTopic.count({ where: { userId } }),
            prisma.forumPost.count({ where: { userId } }),
            prisma.forumReply.count({ where: { userId } }),
            prisma.upvoteForumPost.count({ where: { post: { userId } } }),
        ]);

        const reputation = topicCount * 5 + postCount * 2 + replyCount + upvotesReceived * 3;

        const lastPost = await prisma.forumPost.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
        });

        await prisma.forumUserStats.create({
            data: { userId, topicCount, postCount, replyCount, upvotesReceived, reputation, lastPostAt: lastPost?.createdAt ?? null },
        });
    }

    console.log("Forum seeding complete.");
}
// #endregion

// #region "Main"
export async function runAutomaticSeed(): Promise<void> {
    console.log("=== Starting Automatic Seed ===");
    console.log(`  Movies: ${MOVIES_COUNT}`);
    console.log(`  Series: ${SERIES_COUNT} × ${SEASONS_PER_SERIE} seasons × ${EPISODES_PER_SEASON} episodes`);

    const userRecords = await seedUsers();
    const userIds = userRecords.map((u) => u.id);

    const genreRecords = await seedGenres();
    const genreIds = genreRecords.map((g) => g.id);

    const actorRecords = await seedActors(ACTORS_COUNT);
    const actorIds = actorRecords.map((a) => a.id);

    const crewRecords = await seedCrew(CREW_COUNT);
    const crewIds = crewRecords.map((c) => c.id);

    await seedMovies(MOVIES_COUNT, genreIds, actorIds, crewIds, userIds);
    await seedSeries(SERIES_COUNT, SEASONS_PER_SERIE, EPISODES_PER_SEASON, genreIds, actorIds, crewIds, userIds);
    await seedForum(userIds);

    console.log("=== Automatic Seed Complete ===");
}
// #endregion

if (require.main === module) {
    runAutomaticSeed()
        .then(async () => {
            await prisma.$disconnect();
        })
        .catch(async (e) => {
            console.error("Automatic seed failed:", e);
            await prisma.$disconnect();
            process.exit(1);
        });
}
