import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';
import { AuthGuard } from '../src/auth/guards/auth.guard';
import { OptionalAuthGuard } from '../src/auth/guards/optional-auth.guard';
import { SortOrder } from '../src/modules/movie/dtos/movie-query.dto';
import { JwtStrategy } from '../src/auth/guards/jwt.strategy';
import { MockJwtStrategy } from './mocks/jwt-strategy.mock';

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

  const testMovie = {
    title: 'test movie',
    description: 'test description',
    photoSrc: 'https://example.com/movie-poster.jpg',
    photoSrcProd: 'https://example.com/movie-production.jpg',
    trailerSrc: 'https://example.com/movie-trailer.mp4',
    duration: 120,
    ratingImdb: 8.5,
    dateAired: new Date().toISOString()
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtStrategy)
      .useClass(MockJwtStrategy)
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

    await prisma.$connect();
    await app.init();
  });

  beforeEach(async () => {
    await prisma.movie.deleteMany();
  });

  afterAll(async () => {
    await prisma.movie.deleteMany();
    await prisma.$disconnect();
    await app.close();
  });

  describe('/movies (GET)', () => {
    beforeEach(async () => {
      await prisma.movie.create({ data: testMovie });
    });

    it('should return movies list', () => {
      return request(app.getHttpServer())
        .get('/movies')
        .expect(200)
        .expect((res) => {
          expect(res.body.movies).toBeDefined();
          expect(res.body.movies[0]).toEqual(expect.objectContaining({
            ...testMovie,
            id: expect.any(Number),
            dateAired: expect.any(String)
          }));
        });
    });

    it('should apply filters correctly', () => {
      return request(app.getHttpServer())
        .get('/movies')
        .query({
          title: 'test',
          filterNameString: 'duration',
          filterOperatorString: 'equals',
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
          expect(Array.isArray(res.body.movies)).toBe(true);
        });
    });
  });

  describe('/movies/:id (GET)', () => {
    let movieId: number;

    beforeEach(async () => {
      const movie = await prisma.movie.create({ data: testMovie });
      movieId = movie.id;
    });

    it('should return a single movie', () => {
      return request(app.getHttpServer())
        .get(`/movies/${movieId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(expect.objectContaining({
            ...testMovie,
            id: movieId,
            dateAired: expect.any(String)
          }));
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
          { ...testMovie, title: 'action movie' },
          { ...testMovie, title: 'comedy movie' }
        ],
      });
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
          { ...testMovie, title: 'old movie', dateAired: new Date('2023-01-01').toISOString() },
          { ...testMovie, title: 'new movie', dateAired: new Date('2024-01-01').toISOString() }
        ],
      });
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
        data: Array(5).fill(testMovie),
      });
    });

    it('should return total count of movies', () => {
      return request(app.getHttpServer())
        .get('/movies/count')
        .expect(200)
        .expect((res) => {
          expect(res.body.count).toBe(5);
        });
    });
  });

  describe('/movies (POST)', () => {
    const newMovie = {
      title: 'new movie',
      description: 'new description',
      photoSrc: 'https://example.com/new-poster.jpg',
      photoSrcProd: 'https://example.com/new-production.jpg',
      trailerSrc: 'https://example.com/new-trailer.mp4',
      duration: 120,
      ratingImdb: 8.5,
      dateAired: new Date().toISOString()
    };

    it('should create a new movie', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send(newMovie)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(expect.objectContaining({
            ...newMovie,
            id: expect.any(Number),
            dateAired: expect.any(String)
          }));
        });
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({})
        .expect(400);
    });

    it('should convert title to lowercase', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({ ...newMovie, title: 'NEW MOVIE' })
        .expect(201)
        .expect((res) => {
          expect(res.body.title).toBe('new movie');
        });
    });

    it('should validate image URLs', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({ ...newMovie, photoSrc: 'invalid-url' })
        .expect(400);
    });
  });

  describe('/movies/:id (PUT)', () => {
    let movieId: number;

    beforeEach(async () => {
      const movie = await prisma.movie.create({ data: testMovie });
      movieId = movie.id;
    });

    it('should update an existing movie', () => {
      const updateData = {
        title: 'updated movie',
        description: 'updated description',
        photoSrc: 'https://example.com/updated.jpg',
        photoSrcProd: 'https://example.com/updated-prod.jpg'
      };

      return request(app.getHttpServer())
        .put(`/movies/${movieId}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(expect.objectContaining({
            ...testMovie,
            ...updateData,
            id: movieId,
            title: 'updated movie',
            dateAired: expect.any(String)
          }));
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

  describe('/movies/:id (DELETE)', () => {
    let movieId: number;

    beforeEach(async () => {
      const movie = await prisma.movie.create({ data: testMovie });
      movieId = movie.id;
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
});