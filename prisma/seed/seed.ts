// #region "Imports"
import { PrismaClient } from "@prisma/client";
import { generateDynamicSeedData, SeedStep } from "./dynamicSeed";
import { movies } from "./data/movies";
import { series } from "./data/series";
import { seasons } from "./data/seasons";
import { episodes } from "./data/episodes";
import { actors } from "./data/actors";
import { crew } from "./data/crew";
import { genres } from "./data/genres";
import { users } from "./data/users";
// Import relationship data from relationships.ts
import {
    movieGenres,
    serieGenres,
    castMovies,
    castSeries,
    crewMovies,
    crewSeries,
    movieReviews,
    upvoteMovieReviews,
    downvoteMovieReviews,
    crewReviews,
    upvoteCrewReviews,
    downvoteCrewReviews
} from "./data/relationships";
// #endregion

const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
});

// #region "Delete data function"
async function deleteData() {
    console.log("Deleting existing data...");

    // Delete relationships first to avoid foreign key constraints
    await prisma.serieGenre.deleteMany();
    await prisma.movieGenre.deleteMany();

    await prisma.castMovie.deleteMany();
    await prisma.castSerie.deleteMany();
    await prisma.actorReview.deleteMany();
    await prisma.upvoteActorReview.deleteMany();
    await prisma.downvoteActorReview.deleteMany();

    await prisma.crewMovie.deleteMany();
    await prisma.crewSerie.deleteMany();
    await prisma.crewReview.deleteMany();
    await prisma.upvoteCrewReview.deleteMany();
    await prisma.downvoteCrewReview.deleteMany();

    await prisma.movieReview.deleteMany();
    await prisma.upvoteMovieReview.deleteMany();
    await prisma.downvoteMovieReview.deleteMany();
    await prisma.userMovieFavorite.deleteMany();
    await prisma.userMovieRating.deleteMany();

    await prisma.serieReview.deleteMany();
    await prisma.upvoteSerieReview.deleteMany();
    await prisma.downvoteSerieReview.deleteMany();
    await prisma.userSerieFavorite.deleteMany();
    await prisma.userSerieRating.deleteMany();

    await prisma.actorReview.deleteMany();
    await prisma.upvoteActorReview.deleteMany();
    await prisma.downvoteActorReview.deleteMany();
    await prisma.userActorFavorite.deleteMany();
    await prisma.userActorRating.deleteMany();

    await prisma.crewReview.deleteMany();
    await prisma.upvoteCrewReview.deleteMany();
    await prisma.downvoteCrewReview.deleteMany();
    await prisma.userCrewFavorite.deleteMany();
    await prisma.userCrewRating.deleteMany();

    await prisma.episodeReview.deleteMany();
    await prisma.upvoteEpisodeReview.deleteMany();
    await prisma.downvoteEpisodeReview.deleteMany();
    await prisma.userEpisodeFavorite.deleteMany();
    await prisma.userEpisodeRating.deleteMany();

    await prisma.seasonReview.deleteMany();
    await prisma.upvoteSeasonReview.deleteMany();
    await prisma.downvoteSeasonReview.deleteMany();
    await prisma.userSeasonFavorite.deleteMany();
    await prisma.userSeasonRating.deleteMany();

    await prisma.userFollow.deleteMany();

    await prisma.listMovie.deleteMany();
    await prisma.listSerie.deleteMany();
    await prisma.listSeason.deleteMany();
    await prisma.listEpisode.deleteMany();
    await prisma.listActor.deleteMany();
    await prisma.listCrew.deleteMany();
    await prisma.list.deleteMany();

    // Delete forum data
    await prisma.upvoteForumReply.deleteMany();
    await prisma.downvoteForumReply.deleteMany();
    await prisma.forumReplyHistory.deleteMany();
    await prisma.forumReply.deleteMany();

    await prisma.upvoteForumPost.deleteMany();
    await prisma.downvoteForumPost.deleteMany();
    await prisma.forumPost.deleteMany();

    await prisma.upvoteForumTopic.deleteMany();
    await prisma.downvoteForumTopic.deleteMany();
    await prisma.userForumTopicFavorite.deleteMany();
    await prisma.userForumTopicWatch.deleteMany();
    await prisma.forumTopic.deleteMany();

    await prisma.userForumModerator.deleteMany();
    await prisma.forumUserStats.deleteMany();
    await prisma.forumTag.deleteMany();
    await prisma.forumCategory.deleteMany();

    // Delete main entities
    await prisma.episode.deleteMany();
    await prisma.season.deleteMany();
    await prisma.serie.deleteMany();
    await prisma.movie.deleteMany();
    await prisma.actor.deleteMany();
    await prisma.crew.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.user.deleteMany();

    console.log("All existing data deleted successfully.");
}
// #endregion

// #region "Base seeding function"
async function baseSeeding() {
    console.log("Starting base seeding...");

    for (const user of users) {
        // @ts-ignore - Ignore TypeScript error for password field
        await prisma.user.create({ data: user });
    }

    // Create main entities
    for (const genre of genres) {
        await prisma.genre.create({ data: genre });
    }

    for (const serie of series) {
        await prisma.serie.create({ data: serie });
    }

    for (const movie of movies) {
        await prisma.movie.create({ data: movie });
    }

    for (const season of seasons) {
        await prisma.season.create({ data: season });
    }

    for (const episode of episodes) {
        await prisma.episode.create({ data: episode });
    }

    for (const actor of actors) {
        await prisma.actor.create({ data: actor });
    }

    for (const crewMember of crew) {
        await prisma.crew.create({ data: crewMember });
    }

    // Create relationships
    for (const movieGenre of movieGenres) {
        await prisma.movieGenre.create({ data: movieGenre });
    }

    for (const serieGenre of serieGenres) {
        await prisma.serieGenre.create({ data: serieGenre });
    }

    for (const castMovie of castMovies) {
        await prisma.castMovie.create({ data: castMovie });
    }

    for (const castSerie of castSeries) {
        await prisma.castSerie.create({ data: castSerie });
    }

    for (const crewMovie of crewMovies) {
        await prisma.crewMovie.create({ data: crewMovie });
    }

    for (const crewSerie of crewSeries) {
        await prisma.crewSerie.create({ data: crewSerie });
    }

    // Create reviews and interactions
    for (const movieReviewsData of movieReviews) {
        await prisma.movieReview.create({ data: movieReviewsData });
    }

    for (const upvoteMovieReviewsData of upvoteMovieReviews) {
        await prisma.upvoteMovieReview.create({ data: upvoteMovieReviewsData });
    }

    for (const downvoteMovieReviewsData of downvoteMovieReviews) {
        await prisma.downvoteMovieReview.create({ data: downvoteMovieReviewsData });
    }

    for (const crewReviewsData of crewReviews) {
        await prisma.crewReview.create({ data: crewReviewsData });
    }

    for (const upvoteCrewReviewsData of upvoteCrewReviews) {
        await prisma.upvoteCrewReview.create({ data: upvoteCrewReviewsData });
    }

    for (const downvoteCrewReviewsData of downvoteCrewReviews) {
        await prisma.downvoteCrewReview.create({ data: downvoteCrewReviewsData });
    }

    console.log("Base seeding completed successfully.");
}
// #endregion

const config = {
    useDynamicSeeding: true, // Set to false to use base seeding instead
    deleteBeforeSeeding: false, // Set to true to delete all data before seeding
    dynamicSeedingStartStep: SeedStep.ForumTags // Which step to start from for dynamic seeding
};

async function main() {
    try {
        if (config.deleteBeforeSeeding) {
            await deleteData();
        }

        if (config.useDynamicSeeding) {
            console.log(`Starting dynamic seeding from ${SeedStep[config.dynamicSeedingStartStep]} step...`);
            await generateDynamicSeedData(config.dynamicSeedingStartStep);
            console.log("Dynamic database seeding completed successfully.");
        } else {
            console.log("Using base seeding...");
            await baseSeeding();
            console.log("Base database seeding completed successfully.");
        }

        await prisma.$disconnect();
    } catch (error) {
        console.error("Error during seeding:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();