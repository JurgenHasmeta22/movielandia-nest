import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { generateForumDataMinimal } from "./forumSeedMinimal";
import { generateForumTagData } from "./forumTagSeed";

const prisma = new PrismaClient();

// #region "Helper Functions"
function getRandomRating(): number {
    return Number((Math.random() * (9.9 - 1.0) + 1.0).toFixed(1));
}

function getRandomDate(): Date {
    const start = new Date(1950, 0, 1).getTime();
    const end = new Date().getTime();
    const randomTimestamp = Math.floor(Math.random() * (end - start) + start);
    return new Date(randomTimestamp);
}

function getRandomDuration(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomYoutubeTrailer(): string {
    const trailerIds = [
        "D8La5G1DzCM", "7GdM7gZ1ip4", "BJYJksHREIc", "_Z3QKkl1WyM",
        "dQw4w9WgXcQ", "6ZfuNTqbHE8", "jEDaVHmw7r4", "g4Hbz2jLxvQ",
        "TcMBFSGVi1c", "8Qn_spdM5Zg", "5PSNL1qE6VY", "FB5cYwBYKTQ"
    ];

    return `https://www.youtube.com/embed/${faker.helpers.arrayElement(trailerIds)}`;
}
// #endregion

// #region "Entity Generation Functions"
async function generateMovies(count: number, startId: number): Promise<void> {
    console.log(`Generating ${count} new movies starting from ID ${startId + 1}...`);

    const genres = await prisma.genre.findMany();
    const genreIds = genres.map(genre => genre.id);

    const movieBatch = [];

    for (let i = 0; i < count; i++) {
        const movieId = startId + i + 1;

        const movie = {
            id: movieId,
            title: faker.word.adjective() + " " + faker.word.noun(),
            photoSrc: `http://localhost:4000/images/placeholder.jpg`,
            photoSrcProd: `https://movielandia-avenger22s-projects.vercel.app/images/placeholder.jpg`,
            trailerSrc: getRandomYoutubeTrailer(),
            duration: getRandomDuration(90, 180),
            dateAired: getRandomDate(),
            ratingImdb: getRandomRating(),
            description: faker.lorem.paragraphs(2),
        };

        movieBatch.push(movie);
    }


    for (let i = 0; i < movieBatch.length; i += 10) {
        const batch = movieBatch.slice(i, i + 10);
        await Promise.all(batch.map(movie => prisma.movie.create({ data: movie })));
        console.log(`Created movies ${i + 1} to ${Math.min(i + 10, movieBatch.length)} of ${movieBatch.length}`);
    }

    console.log("Assigning genres to new movies...");

    for (let i = 0; i < movieBatch.length; i++) {
        const movieId = movieBatch[i].id;
        const genreCount = Math.floor(Math.random() * 3) + 1;
        const selectedGenreIds = faker.helpers.arrayElements(genreIds, genreCount);

        await Promise.all(selectedGenreIds.map((genreId: number) =>
            prisma.movieGenre.create({
                data: {
                    movieId,
                    genreId
                }
            })
        ));
    }

    console.log(`Successfully generated ${count} new movies with genres.`);
}

async function generateActors(count: number, startId: number): Promise<void> {
    console.log(`Generating ${count} new actors starting from ID ${startId + 1}...`);

    const actorBatch = [];

    for (let i = 0; i < count; i++) {
        const actorId = startId + i + 1;

        const actor = {
            id: actorId,
            fullname: faker.person.fullName(),
            photoSrc: `http://localhost:4000/images/placeholder.jpg`,
            photoSrcProd: `https://movielandia-avenger22s-projects.vercel.app/images/placeholder.jpg`,
            description: faker.lorem.paragraphs(1),
            debut: faker.date.between({ from: '1980-01-01', to: '2020-01-01' }).getFullYear().toString(),
        };

        actorBatch.push(actor);
    }

    for (let i = 0; i < actorBatch.length; i += 10) {
        const batch = actorBatch.slice(i, i + 10);
        await Promise.all(batch.map(actor => prisma.actor.create({ data: actor })));
        console.log(`Created actors ${i + 1} to ${Math.min(i + 10, actorBatch.length)} of ${actorBatch.length}`);
    }

    console.log(`Successfully generated ${count} new actors.`);
}

async function generateCrew(count: number, startId: number): Promise<void> {
    console.log(`Generating ${count} new crew members starting from ID ${startId + 1}...`);

    const crewRoles = [
        "Director", "Producer", "Screenwriter", "Cinematographer",
        "Film Editor", "Production Designer", "Costume Designer",
        "Music Composer", "Sound Designer", "Visual Effects Supervisor"
    ];

    const crewBatch = [];

    for (let i = 0; i < count; i++) {
        const crewId = startId + i + 1;

        const crew = {
            id: crewId,
            fullname: faker.person.fullName(),
            photoSrc: `http://localhost:4000/images/placeholder.jpg`,
            photoSrcProd: `https://movielandia-avenger22s-projects.vercel.app/images/placeholder.jpg`,
            description: faker.lorem.paragraphs(1),
            debut: faker.date.between({ from: '1980-01-01', to: '2020-01-01' }).getFullYear().toString(),
            role: faker.helpers.arrayElement(crewRoles),
        };

        crewBatch.push(crew);
    }

    for (let i = 0; i < crewBatch.length; i += 10) {
        const batch = crewBatch.slice(i, i + 10);
        await Promise.all(batch.map(crew => prisma.crew.create({ data: crew })));
        console.log(`Created crew members ${i + 1} to ${Math.min(i + 10, crewBatch.length)} of ${crewBatch.length}`);
    }

    console.log(`Successfully generated ${count} new crew members.`);
}

async function generateSeries(count: number, startSeriesId: number, startSeasonId: number): Promise<void> {
    console.log(`Generating ${count} new series starting from ID ${startSeriesId + 1}...`);

    const genres = await prisma.genre.findMany();
    const genreIds = genres.map(genre => genre.id);

    const serieBatch = [];
    let currentSeasonId = startSeasonId;
    let currentEpisodeId = await prisma.episode.count();

    for (let i = 0; i < count; i++) {
        const serieId = startSeriesId + i + 1;

        const serie = {
            id: serieId,
            title: faker.word.adjective() + " " + faker.word.noun(),
            photoSrc: `http://localhost:4000/images/placeholder.jpg`,
            photoSrcProd: `https://movielandia-avenger22s-projects.vercel.app/images/placeholder.jpg`,
            trailerSrc: getRandomYoutubeTrailer(),
            description: faker.lorem.paragraphs(2),
            dateAired: getRandomDate(),
            ratingImdb: getRandomRating(),
        };

        serieBatch.push(serie);
    }

    for (let i = 0; i < serieBatch.length; i += 10) {
        const batch = serieBatch.slice(i, i + 10);
        await Promise.all(batch.map(serie => prisma.serie.create({ data: serie })));
        console.log(`Created series ${i + 1} to ${Math.min(i + 10, serieBatch.length)} of ${serieBatch.length}`);
    }

    console.log("Assigning genres to new series...");

    for (let i = 0; i < serieBatch.length; i++) {
        const serieId = serieBatch[i].id;

        const genreCount = Math.floor(Math.random() * 3) + 1;
        const selectedGenreIds = faker.helpers.arrayElements(genreIds, genreCount);

        await Promise.all(selectedGenreIds.map((genreId: number) =>
            prisma.serieGenre.create({
                data: {
                    serieId,
                    genreId
                }
            })
        ));
    }

    console.log("Generating seasons and episodes for new series...");

    for (const serie of serieBatch) {
        const serieId = serie.id;
        const seasonCount = Math.floor(Math.random() * 3) + 1; // 1-3 seasons per serie

        for (let s = 0; s < seasonCount; s++) {
            currentSeasonId++;

            const season = await prisma.season.create({
                data: {
                    id: currentSeasonId,
                    title: `${serie.title} S${s + 1}`,
                    photoSrc: serie.photoSrc,
                    photoSrcProd: serie.photoSrcProd,
                    trailerSrc: getRandomYoutubeTrailer(),
                    description: `Season ${s + 1} of ${serie.title}. ${faker.lorem.paragraph()}`,
                    dateAired: getRandomDate(),
                    ratingImdb: getRandomRating(),
                    serieId: serieId,
                }
            });

            const episodeCount = Math.floor(Math.random() * 8) + 3; // 3-10 episodes per season

            for (let e = 0; e < episodeCount; e++) {
                currentEpisodeId++;

                await prisma.episode.create({
                    data: {
                        id: currentEpisodeId,
                        title: `${serie.title} S${s + 1} E${e + 1}`,
                        photoSrc: serie.photoSrc,
                        photoSrcProd: serie.photoSrcProd,
                        trailerSrc: getRandomYoutubeTrailer(),
                        duration: getRandomDuration(20, 60),
                        description: `Episode ${e + 1} of Season ${s + 1}. ${faker.lorem.paragraph()}`,
                        dateAired: getRandomDate(),
                        ratingImdb: getRandomRating(),
                        seasonId: season.id,
                    }
                });
            }
        }
    }

    console.log(`Successfully generated ${count} new series with seasons and episodes.`);
}

async function generateRelationships(): Promise<void> {
    console.log("Generating cast and crew relationships...");

    const movies = await prisma.movie.findMany({
        select: { id: true },
        orderBy: { id: 'asc' }
    });

    const series = await prisma.serie.findMany({
        select: { id: true },
        orderBy: { id: 'asc' }
    });

    const actors = await prisma.actor.findMany({
        select: { id: true },
        orderBy: { id: 'asc' }
    });

    const crew = await prisma.crew.findMany({
        select: { id: true },
        orderBy: { id: 'asc' }
    });

    console.log("Assigning actors to movies...");

    let castMovieId = await prisma.castMovie.count();

    const existingCastMovies = await prisma.castMovie.findMany({
        select: {
            movieId: true,
            actorId: true
        }
    });

    const existingMovieActorRelationships = new Set();

    for (const rel of existingCastMovies) {
        existingMovieActorRelationships.add(`${rel.movieId}-${rel.actorId}`);
    }

    for (const movie of movies) {
        if (movie.id <= 10) continue;

        const actorCount = Math.floor(Math.random() * 6) + 3;
        const selectedActors = faker.helpers.arrayElements(actors, actorCount);

        for (const actor of selectedActors) {
            const relationshipKey = `${movie.id}-${actor.id}`;

            if (existingMovieActorRelationships.has(relationshipKey)) {
                console.log(`Skipping duplicate castMovie relationship: Movie ${movie.id} - Actor ${actor.id}`);
                continue;
            }

            castMovieId++;
            existingMovieActorRelationships.add(relationshipKey);

            try {
                await prisma.castMovie.create({
                    data: {
                        id: castMovieId,
                        movieId: movie.id,
                        actorId: actor.id
                    }
                });
            } catch (error: any) {
                if (error.code === 'P2002') {
                    console.log(`Skipping duplicate castMovie relationship: Movie ${movie.id} - Actor ${actor.id}`);
                } else {
                    throw error;
                }
            }
        }
    }

    console.log("Assigning actors to series...");

    const highestCastSerieId = await prisma.castSerie.findFirst({
        orderBy: {
            id: 'desc'
        },
        select: {
            id: true
        }
    });

    let castSerieId = highestCastSerieId ? highestCastSerieId.id : 0;
    console.log(`Starting castSerie IDs from ${castSerieId + 1}`);

    const existingCastSeries = await prisma.castSerie.findMany({
        select: {
            serieId: true,
            actorId: true
        }
    });

    const existingRelationships = new Set();

    for (const rel of existingCastSeries) {
        existingRelationships.add(`${rel.serieId}-${rel.actorId}`);
    }

    console.log(`Found ${existingRelationships.size} existing castSerie relationships`);

    for (const serie of series) {
        if (serie.id <= 5) continue;

        const actorCount = Math.floor(Math.random() * 6) + 3;
        const selectedActors = faker.helpers.arrayElements(actors, actorCount);

        console.log(`Processing serie ${serie.id} with ${selectedActors.length} actors`);

        for (const actor of selectedActors) {
            const relationshipKey = `${serie.id}-${actor.id}`;

            if (existingRelationships.has(relationshipKey)) {
                console.log(`Skipping duplicate castSerie relationship: Serie ${serie.id} - Actor ${actor.id}`);
                continue;
            }

            const existingRelation = await prisma.castSerie.findFirst({
                where: {
                    serieId: serie.id,
                    actorId: actor.id
                }
            });

            if (existingRelation) {
                console.log(`Found existing castSerie in DB: Serie ${serie.id} - Actor ${actor.id}`);
                existingRelationships.add(relationshipKey);
                continue;
            }

            castSerieId++;
            existingRelationships.add(relationshipKey);

            try {
                await prisma.castSerie.create({
                    data: {
                        id: castSerieId,
                        serieId: serie.id,
                        actorId: actor.id
                    }
                });

                console.log(`Created castSerie: ID ${castSerieId}, Serie ${serie.id} - Actor ${actor.id}`);
            } catch (error: any) {
                if (error.code === 'P2002') {
                    console.log(`Skipping duplicate castSerie relationship: Serie ${serie.id} - Actor ${actor.id}`);
                    castSerieId--;
                } else {
                    console.error(`Error creating castSerie: ${error.message}`);
                    throw error;
                }
            }
        }
    }

    console.log("Assigning crew to movies...");

    let crewMovieId = await prisma.crewMovie.count();

    const existingCrewMovies = await prisma.crewMovie.findMany({
        select: {
            movieId: true,
            crewId: true
        }
    });

    const existingMovieCrewRelationships = new Set();

    for (const rel of existingCrewMovies) {
        existingMovieCrewRelationships.add(`${rel.movieId}-${rel.crewId}`);
    }

    for (const movie of movies) {
        if (movie.id <= 10) continue;

        const crewCount = Math.floor(Math.random() * 4) + 2;
        const selectedCrew = faker.helpers.arrayElements(crew, crewCount);

        for (const crewMember of selectedCrew) {
            const relationshipKey = `${movie.id}-${crewMember.id}`;

            if (existingMovieCrewRelationships.has(relationshipKey)) {
                console.log(`Skipping duplicate crewMovie relationship: Movie ${movie.id} - Crew ${crewMember.id}`);
                continue;
            }

            crewMovieId++;
            existingMovieCrewRelationships.add(relationshipKey);

            try {
                await prisma.crewMovie.create({
                    data: {
                        id: crewMovieId,
                        movieId: movie.id,
                        crewId: crewMember.id
                    }
                });
            } catch (error: any) {
                if (error.code === 'P2002') {
                    console.log(`Skipping duplicate crewMovie relationship: Movie ${movie.id} - Crew ${crewMember.id}`);
                } else {
                    throw error;
                }
            }
        }
    }

    console.log("Assigning crew to series...");

    const highestCrewSerieId = await prisma.crewSerie.findFirst({
        orderBy: {
            id: 'desc'
        },
        select: {
            id: true
        }
    });

    let crewSerieId = highestCrewSerieId ? highestCrewSerieId.id : 0;
    console.log(`Starting crewSerie IDs from ${crewSerieId + 1}`);

    const existingCrewSeries = await prisma.crewSerie.findMany({
        select: {
            serieId: true,
            crewId: true
        }
    });

    const existingSerieCrewRelationships = new Set();

    for (const rel of existingCrewSeries) {
        existingSerieCrewRelationships.add(`${rel.serieId}-${rel.crewId}`);
    }

    console.log(`Found ${existingSerieCrewRelationships.size} existing crewSerie relationships`);

    for (const serie of series) {
        if (serie.id <= 5) continue;

        const crewCount = Math.floor(Math.random() * 4) + 2;
        const selectedCrew = faker.helpers.arrayElements(crew, crewCount);
        console.log(`Processing serie ${serie.id} with ${selectedCrew.length} crew members`);

        for (const crewMember of selectedCrew) {
            const relationshipKey = `${serie.id}-${crewMember.id}`;

            if (existingSerieCrewRelationships.has(relationshipKey)) {
                console.log(`Skipping duplicate crewSerie relationship: Serie ${serie.id} - Crew ${crewMember.id}`);
                continue;
            }

            const existingRelation = await prisma.crewSerie.findFirst({
                where: {
                    serieId: serie.id,
                    crewId: crewMember.id
                }
            });

            if (existingRelation) {
                console.log(`Found existing crewSerie in DB: Serie ${serie.id} - Crew ${crewMember.id}`);
                existingSerieCrewRelationships.add(relationshipKey);
                continue;
            }

            crewSerieId++;
            existingSerieCrewRelationships.add(relationshipKey);

            try {
                await prisma.crewSerie.create({
                    data: {
                        id: crewSerieId,
                        serieId: serie.id,
                        crewId: crewMember.id
                    }
                });

                console.log(`Created crewSerie: ID ${crewSerieId}, Serie ${serie.id} - Crew ${crewMember.id}`);
            } catch (error: any) {
                if (error.code === 'P2002') {
                    console.log(`Skipping duplicate crewSerie relationship: Serie ${serie.id} - Crew ${crewMember.id}`);
                    crewSerieId--;
                } else {
                    console.error(`Error creating crewSerie: ${error.message}`);
                    throw error;
                }
            }
        }
    }

    console.log("Successfully generated all entity relationships.");
}

async function generateReviewsAndRatings(): Promise<void> {
    console.log("Generating reviews and ratings for all entities...");

    const movies = await prisma.movie.findMany({
        select: { id: true },
        orderBy: { id: 'asc' }
    });

    const series = await prisma.serie.findMany({
        select: { id: true },
        orderBy: { id: 'asc' }
    });

    const actors = await prisma.actor.findMany({
        select: { id: true },
        orderBy: { id: 'asc' }
    });

    const crew = await prisma.crew.findMany({
        select: { id: true },
        orderBy: { id: 'asc' }
    });

    const users = await prisma.user.findMany({
        select: { id: true },
        orderBy: { id: 'asc' }
    });

    if (users.length === 0) {
        console.log("No users found to create reviews and ratings. Skipping this step.");
        return;
    }

    console.log("Generating movie reviews and ratings...");
    let movieReviewId = await prisma.movieReview.count();

    for (const movie of movies) {
        if (movie.id <= 10) continue;

        const reviewerCount = Math.floor(Math.random() * 3) + 1;
        const reviewers = faker.helpers.arrayElements(users, reviewerCount);

        for (const user of reviewers) {
            movieReviewId++;
            const rating = getRandomRating();

            const review = await prisma.movieReview.create({
                data: {
                    id: movieReviewId,
                    userId: user.id,
                    movieId: movie.id,
                    content: faker.lorem.paragraphs(1),
                    rating,
                    createdAt: new Date(),
                }
            });

            const voterCount = Math.floor(Math.random() * 3) + 1;
            const voters = faker.helpers.arrayElements(
                users.filter(u => u.id !== user.id),
                voterCount
            );

            for (const voter of voters) {
                if (Math.random() > 0.5) {
                    await prisma.upvoteMovieReview.create({
                        data: {
                            userId: voter.id,
                            movieId: movie.id,
                            movieReviewId: review.id
                        }
                    });
                } else {
                    await prisma.downvoteMovieReview.create({
                        data: {
                            userId: voter.id,
                            movieId: movie.id,
                            movieReviewId: review.id
                        }
                    });
                }
            }
        }

        const raterCount = Math.floor(Math.random() * 4) + 2;
        const raters = faker.helpers.arrayElements(
            users.filter(u => !reviewers.some(r => r.id === u.id)),
            raterCount
        );

        for (const user of raters) {
            try {
                await prisma.userMovieRating.create({
                    data: {
                        userId: user.id,
                        movieId: movie.id,
                        rating: getRandomRating()
                    }
                });
            } catch (error: any) {
                if (error.code === 'P2002') {
                    console.log(`Skipping duplicate movie rating: Movie ${movie.id} - User ${user.id}`);
                } else {
                    throw error;
                }
            }

            if (Math.random() > 0.6) {
                try {
                    await prisma.userMovieFavorite.create({
                        data: {
                            userId: user.id,
                            movieId: movie.id
                        }
                    });
                } catch (error: any) {
                    if (error.code === 'P2002') {
                        console.log(`Skipping duplicate movie favorite: Movie ${movie.id} - User ${user.id}`);
                    } else {
                        throw error;
                    }
                }
            }
        }
    }

    console.log("Generating serie reviews and ratings...");
    let serieReviewId = await prisma.serieReview.count();

    for (const serie of series) {
        if (serie.id <= 5) continue;

        const reviewerCount = Math.floor(Math.random() * 3) + 1;
        const reviewers = faker.helpers.arrayElements(users, reviewerCount);

        for (const user of reviewers) {
            serieReviewId++;
            const rating = getRandomRating();
            const review = await prisma.serieReview.create({
                data: {
                    id: serieReviewId,
                    userId: user.id,
                    serieId: serie.id,
                    content: faker.lorem.paragraphs(1),
                    rating,
                    createdAt: new Date(),
                }
            });

            const voterCount = Math.floor(Math.random() * 3) + 1;
            const voters = faker.helpers.arrayElements(
                users.filter(u => u.id !== user.id),
                voterCount
            );

            for (const voter of voters) {
                if (Math.random() > 0.5) {
                    await prisma.upvoteSerieReview.create({
                        data: {
                            userId: voter.id,
                            serieId: serie.id,
                            serieReviewId: review.id
                        }
                    });
                } else {
                    await prisma.downvoteSerieReview.create({
                        data: {
                            userId: voter.id,
                            serieId: serie.id,
                            serieReviewId: review.id
                        }
                    });
                }
            }
        }

        const raterCount = Math.floor(Math.random() * 4) + 2;
        const raters = faker.helpers.arrayElements(
            users.filter(u => !reviewers.some(r => r.id === u.id)),
            raterCount
        );

        for (const user of raters) {
            try {
                await prisma.userSerieRating.create({
                    data: {
                        userId: user.id,
                        serieId: serie.id,
                        rating: getRandomRating()
                    }
                });
            } catch (error: any) {
                if (error.code === 'P2002') {
                    console.log(`Skipping duplicate serie rating: Serie ${serie.id} - User ${user.id}`);
                } else {
                    throw error;
                }
            }

            if (Math.random() > 0.6) {
                try {
                    await prisma.userSerieFavorite.create({
                        data: {
                            userId: user.id,
                            serieId: serie.id
                        }
                    });
                } catch (error: any) {
                    if (error.code === 'P2002') {
                        console.log(`Skipping duplicate serie favorite: Serie ${serie.id} - User ${user.id}`);
                    } else {
                        throw error;
                    }
                }
            }
        }
    }

    console.log("Generating actor reviews and ratings...");
    let actorReviewId = await prisma.actorReview.count();

    for (const actor of actors) {
        if (actor.id <= 10) continue;

        const reviewerCount = Math.floor(Math.random() * 2) + 1;
        const reviewers = faker.helpers.arrayElements(users, reviewerCount);

        for (const user of reviewers) {
            actorReviewId++;
            const rating = getRandomRating();

            try {
                const review = await prisma.actorReview.create({
                    data: {
                        id: actorReviewId,
                        userId: user.id,
                        actorId: actor.id,
                        content: faker.lorem.paragraphs(1),
                        rating,
                        createdAt: new Date(),
                    }
                });

                const voterCount = Math.floor(Math.random() * 2) + 1;
                const voters = faker.helpers.arrayElements(
                    users.filter(u => u.id !== user.id),
                    voterCount
                );

                for (const voter of voters) {
                    if (Math.random() > 0.5) {
                        await prisma.upvoteActorReview.create({
                            data: {
                                userId: voter.id,
                                actorId: actor.id,
                                actorReviewId: review.id
                            }
                        });
                    } else {
                        await prisma.downvoteActorReview.create({
                            data: {
                                userId: voter.id,
                                actorId: actor.id,
                                actorReviewId: review.id
                            }
                        });
                    }
                }
            } catch (error) {
                console.log(`Skipping duplicate actor review for actor ${actor.id} by user ${user.id}`);
            }
        }

        const raterCount = Math.floor(Math.random() * 3) + 1;
        const raters = faker.helpers.arrayElements(
            users.filter(u => !reviewers.some(r => r.id === u.id)),
            raterCount
        );

        for (const user of raters) {
            try {
                await prisma.userActorRating.create({
                    data: {
                        userId: user.id,
                        actorId: actor.id,
                        rating: getRandomRating()
                    }
                });

                if (Math.random() > 0.7) {
                    await prisma.userActorFavorite.create({
                        data: {
                            userId: user.id,
                            actorId: actor.id
                        }
                    });
                }
            } catch (error) {
                console.log(`Skipping duplicate actor rating for actor ${actor.id} by user ${user.id}`);
            }
        }
    }

    console.log("Generating crew reviews and ratings...");
    let crewReviewId = await prisma.crewReview.count();

    for (const crewMember of crew) {
        if (crewMember.id <= 10) continue;

        if (Math.random() > 0.3) {
            const user = faker.helpers.arrayElement(users);
            crewReviewId++;
            const rating = getRandomRating();

            try {
                const review = await prisma.crewReview.create({
                    data: {
                        id: crewReviewId,
                        userId: user.id,
                        crewId: crewMember.id,
                        content: faker.lorem.paragraphs(1),
                        rating,
                        createdAt: new Date(),
                    }
                });

                const voterCount = Math.floor(Math.random() * 2) + 1;
                const voters = faker.helpers.arrayElements(
                    users.filter(u => u.id !== user.id),
                    voterCount
                );

                for (const voter of voters) {
                    if (Math.random() > 0.5) {
                        await prisma.upvoteCrewReview.create({
                            data: {
                                userId: voter.id,
                                crewId: crewMember.id,
                                crewReviewId: review.id
                            }
                        });
                    } else {
                        await prisma.downvoteCrewReview.create({
                            data: {
                                userId: voter.id,
                                crewId: crewMember.id,
                                crewReviewId: review.id
                            }
                        });
                    }
                }
            } catch (error) {
                console.log(`Skipping duplicate crew review for crew ${crewMember.id} by user ${user.id}`);
            }
        }
    }

    console.log("Successfully generated all reviews and ratings.");
}
// #endregion

// #region "Main Function"
export enum SeedStep {
    Movies = 1,
    Series = 2,
    Actors = 3,
    Crew = 4,
    Relationships = 5,
    Reviews = 6,
    Forum = 7,
    ForumTags = 8
}

export async function generateDynamicSeedData(startFromStep: SeedStep = SeedStep.Movies) {
    console.log("Starting dynamic data seeding...");

    const existingMoviesCount = await prisma.movie.count();
    const existingSeriesCount = await prisma.serie.count();
    const existingSeasonsCount = await prisma.season.count();
    const existingEpisodesCount = await prisma.episode.count();
    const existingActorsCount = await prisma.actor.count();
    const existingCrewCount = await prisma.crew.count();

    console.log(`Existing data counts:
      - Movies: ${existingMoviesCount}
      - Series: ${existingSeriesCount}
      - Seasons: ${existingSeasonsCount}
      - Episodes: ${existingEpisodesCount}
      - Actors: ${existingActorsCount}
      - Crew: ${existingCrewCount}
    `);

    const newMoviesCount = 100;
    const newSeriesCount = 100;
    const newActorsCount = 100;
    const newCrewCount = 100;

    try {
        if (startFromStep <= SeedStep.Movies) {
            console.log("Generating new movies...");
            await generateMovies(newMoviesCount, existingMoviesCount);
        } else {
            console.log("Skipping movie generation...");
        }

        if (startFromStep <= SeedStep.Series) {
            console.log("Generating new series and seasons...");
            await generateSeries(newSeriesCount, existingSeriesCount, existingSeasonsCount);
        } else {
            console.log("Skipping series generation...");
        }

        if (startFromStep <= SeedStep.Actors) {
            console.log("Generating new actors...");
            await generateActors(newActorsCount, existingActorsCount);
        } else {
            console.log("Skipping actors generation...");
        }

        if (startFromStep <= SeedStep.Crew) {
            console.log("Generating new crew members...");
            await generateCrew(newCrewCount, existingCrewCount);
        } else {
            console.log("Skipping crew generation...");
        }

        if (startFromStep <= SeedStep.Relationships) {
            console.log("Generating relationships between entities...");
            await generateRelationships();
        } else {
            console.log("Skipping relationships generation...");
        }

        if (startFromStep <= SeedStep.Reviews) {
            console.log("Generating reviews and ratings...");
            await generateReviewsAndRatings();
        } else {
            console.log("Skipping reviews and ratings generation...");
        }

        if (startFromStep <= SeedStep.Forum) {
            console.log("Generating forum data...");
            await generateForumDataMinimal();
        } else {
            console.log("Skipping forum data generation...");
        }

        if (startFromStep <= SeedStep.ForumTags) {
            console.log("Generating forum tag data...");
            await generateForumTagData();
        } else {
            console.log("Skipping forum tag data generation...");
        }

        console.log("Dynamic seeding completed successfully!");
    } catch (error) {
        console.error("Error during dynamic seeding:", error);
        throw error;
    }
}
// #endregion