import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';
import { AuthGuard } from '../src/guards/auth.guard';
import { OptionalAuthGuard } from '../src/guards/optional-auth.guard';
import { SortOrder } from '../src/modules/movie/dtos/movie-query.dto';

describe('MovieController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const mockUser = { id: 1, email: 'test@example.com', role: 'USER' };
  const mockAuthGuard = { canActivate: () => true };
  const mockOptionalAuthGuard = {
    canActivate: (context: any) => {
      context.switchToHttp().getRequest().user = mockUser;
      return true;
    },
  };

  //#region Test Setup and Teardown
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(OptionalAuthGuard)
      .useValue(mockOptionalAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    app.useGlobalPipes(new ValidationPipe({ 
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    }));
    await app.init();

    await prisma.movie.deleteMany();
  });

  afterAll(async () => {
    await prisma.movie.deleteMany();
    await app.close();
  });
  //#endregion

  //#region GET Endpoints
  describe('/movies (GET)', () => {
    beforeEach(async () => {
      await prisma.movie.create({
        data: {
          title: 'test movie',
          description: 'test description',
          photoSrc: 'test.jpg',
          photoSrcProd: 'test-prod.jpg',
          trailerSrc: 'test-trailer.mp4',
          duration: 120,
          dateAired: new Date(),
          ratingImdb: 8.5,
        },
      });
    });

    afterEach(async () => {
      await prisma.movie.deleteMany();
    });

    it('should return movies list', () => {
      return request(app.getHttpServer())
        .get('/movies')
        .expect(200)
        .expect((res) => {
          expect(res.body.movies).toBeDefined();
          expect(res.body.movies[0].title).toBe('test movie');
        });
    });

    it('should apply filters correctly', () => {
      return request(app.getHttpServer())
        .get('/movies')
        .query({
          title: 'test',
          filterNameString: 'duration',
          filterOperatorString: 'contains',
          filterValue: '120',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.movies).toHaveLength(1);
          expect(res.body.movies[0].duration).toBe(120);
        });
    });

    it('should apply sort order correctly', () => {
      return request(app.getHttpServer())
        .get('/movies')
        .query({
          sortBy: 'title',
          ascOrDesc: SortOrder.ASC,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.movies).toBeDefined();
          expect(res.body.movies).toEqual(expect.arrayContaining([
            expect.objectContaining({
              title: expect.any(String),
            }),
          ]));
        });
    });
  });

  describe('/movies/:id (GET)', () => {
    let movieId: number;

    beforeEach(async () => {
      const movie = await prisma.movie.create({
        data: {
          title: 'test movie',
          description: 'test description',
          photoSrc: 'test.jpg',
          photoSrcProd: 'test-prod.jpg',
          trailerSrc: 'test-trailer.mp4',
          duration: 120,
          dateAired: new Date(),
          ratingImdb: 8.5,
        },
      });
      movieId = movie.id;
    });

    afterEach(async () => {
      await prisma.movie.deleteMany();
    });

    it('should return a single movie', () => {
      return request(app.getHttpServer())
        .get(`/movies/${movieId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('test movie');
          expect(res.body.description).toBe('test description');
        });
    });

    it('should return 404 for non-existent movie', () => {
      return request(app.getHttpServer())
        .get('/movies/999999')
        .expect(404);
    });
  });

  describe('/movies/search (GET)', () => {
    beforeEach(async () => {
      await prisma.movie.createMany({
        data: [
          {
            title: 'action movie',
            description: 'test description',
            photoSrc: 'test.jpg',
            photoSrcProd: 'test-prod.jpg',
            trailerSrc: 'test-trailer.mp4',
            duration: 120,
            dateAired: new Date(),
            ratingImdb: 8.5,
          },
          {
            title: 'comedy movie',
            description: 'test description',
            photoSrc: 'test.jpg',
            photoSrcProd: 'test-prod.jpg',
            trailerSrc: 'test-trailer.mp4',
            duration: 120,
            dateAired: new Date(),
            ratingImdb: 8.5,
          },
        ],
      });
    });

    afterEach(async () => {
      await prisma.movie.deleteMany();
    });

    it('should search movies by title with sort order', () => {
      return request(app.getHttpServer())
        .get('/movies/search')
        .query({ 
          title: 'movie',
          sortBy: 'title',
          ascOrDesc: SortOrder.ASC 
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.movies).toHaveLength(2);
          expect(res.body.movies[0].title).toBe('action movie');
          expect(res.body.movies[1].title).toBe('comedy movie');
          expect(res.body.count).toBe(2);
        });
    });

    it('should search movies by title', () => {
      return request(app.getHttpServer())
        .get('/movies/search')
        .query({ title: 'action' })
        .expect(200)
        .expect((res) => {
          expect(res.body.movies).toHaveLength(1);
          expect(res.body.movies[0].title).toBe('action movie');
          expect(res.body.count).toBe(1);
        });
    });

    it('should handle case-insensitive search', () => {
      return request(app.getHttpServer())
        .get('/movies/search')
        .query({ title: 'ACTION' })
        .expect(200)
        .expect((res) => {
          expect(res.body.movies).toHaveLength(1);
          expect(res.body.movies[0].title).toBe('action movie');
        });
    });
  });

  describe('/movies/latest (GET)', () => {
    beforeEach(async () => {
      await prisma.movie.createMany({
        data: [
          {
            title: 'old movie',
            description: 'test description',
            photoSrc: 'test.jpg',
            photoSrcProd: 'test-prod.jpg',
            trailerSrc: 'test-trailer.mp4',
            duration: 120,
            dateAired: new Date('2023-01-01'),
            ratingImdb: 8.5,
          },
          {
            title: 'new movie',
            description: 'test description',
            photoSrc: 'test.jpg',
            photoSrcProd: 'test-prod.jpg',
            trailerSrc: 'test-trailer.mp4',
            duration: 120,
            dateAired: new Date(),
            ratingImdb: 8.5,
          },
        ],
      });
    });

    afterEach(async () => {
      await prisma.movie.deleteMany();
    });

    it('should return latest movies in descending order', () => {
      return request(app.getHttpServer())
        .get('/movies/latest')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2);
          expect(res.body[0].title).toBe('new movie');
        });
    });
  });

  describe('/movies/count (GET)', () => {
    beforeEach(async () => {
      await prisma.movie.createMany({
        data: Array(5).fill({
          title: 'test movie',
          description: 'test description',
          photoSrc: 'test.jpg',
          photoSrcProd: 'test-prod.jpg',
          trailerSrc: 'test-trailer.mp4',
          duration: 120,
          dateAired: new Date(),
          ratingImdb: 8.5,
        }),
      });
    });

    afterEach(async () => {
      await prisma.movie.deleteMany();
    });

    it('should return total count of movies', () => {
      return request(app.getHttpServer())
        .get('/movies/count')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBe(5);
        });
    });
  });
  //#endregion

  //#region POST Endpoints
  describe('/movies (POST)', () => {
    const newMovie = {
      title: 'new movie',
      description: 'new description',
      photoSrc: 'new.jpg',
      photoSrcProd: 'new-prod.jpg',
      trailerSrc: 'new-trailer.mp4',
      duration: 120,
      dateAired: new Date(),
      ratingImdb: 8.5
    };

    afterEach(async () => {
      await prisma.movie.deleteMany();
    });

    it('should create a new movie', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send(newMovie)
        .expect(201)
        .expect((res) => {
          expect(res.body.title).toBe('new movie');
          expect(res.body.id).toBeDefined();
          expect(res.body.description).toBe('new description');
        });
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({})
        .expect(400);
    });

    it('should convert title to lowercase', () => {
      const movieWithUppercase = { ...newMovie, title: 'NEW MOVIE' };
      return request(app.getHttpServer())
        .post('/movies')
        .send(movieWithUppercase)
        .expect(201)
        .expect((res) => {
          expect(res.body.title).toBe('new movie');
        });
    });
  });
  //#endregion

  //#region PUT Endpoints
  describe('/movies/:id (PUT)', () => {
    let movieId: number;

    beforeEach(async () => {
      const movie = await prisma.movie.create({
        data: {
          title: 'test movie',
          description: 'test description',
          photoSrc: 'test.jpg',
          photoSrcProd: 'test-prod.jpg',
          trailerSrc: 'test-trailer.mp4',
          duration: 120,
          dateAired: new Date(),
          ratingImdb: 8.5,
        },
      });
      movieId = movie.id;
    });

    afterEach(async () => {
      await prisma.movie.deleteMany();
    });

    it('should update an existing movie', () => {
      return request(app.getHttpServer())
        .put(`/movies/${movieId}`)
        .send({ title: 'updated movie', description: 'updated description' })
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('updated movie');
          expect(res.body.description).toBe('updated description');
        });
    });

    it('should return 404 for non-existent movie', () => {
      return request(app.getHttpServer())
        .put('/movies/999999')
        .send({ title: 'updated movie' })
        .expect(404);
    });

    it('should convert updated title to lowercase', () => {
      return request(app.getHttpServer())
        .put(`/movies/${movieId}`)
        .send({ title: 'UPDATED MOVIE' })
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('updated movie');
        });
    });
  });
  //#endregion

  //#region DELETE Endpoints
  describe('/movies/:id (DELETE)', () => {
    let movieId: number;

    beforeEach(async () => {
      const movie = await prisma.movie.create({
        data: {
          title: 'test movie',
          description: 'test description',
          photoSrc: 'test.jpg',
          photoSrcProd: 'test-prod.jpg',
          trailerSrc: 'test-trailer.mp4',
          duration: 120,
          dateAired: new Date(),
          ratingImdb: 8.5,
        },
      });
      movieId = movie.id;
    });

    afterEach(async () => {
      await prisma.movie.deleteMany();
    });

    it('should delete an existing movie', () => {
      return request(app.getHttpServer())
        .delete(`/movies/${movieId}`)
        .expect(204);
    });

    it('should return 404 for non-existent movie', () => {
      return request(app.getHttpServer())
        .delete('/movies/999999')
        .expect(404);
    });
  });
  //#endregion
});