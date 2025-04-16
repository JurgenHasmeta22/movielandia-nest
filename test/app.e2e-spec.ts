import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtStrategy } from '../src/auth/guards/jwt.strategy';
import { MockJwtStrategy } from './mocks/jwt-strategy.mock';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
        .overrideProvider(JwtStrategy)
        .useClass(MockJwtStrategy)
        .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Movielandia24 REST API');
    });
});
