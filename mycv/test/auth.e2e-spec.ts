import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const user = {
      name: 'Test',
      email: 'test@test2.com',
      password: 'password',
    };

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(201)
      .then((response) => {
        const { id, name, email, isActive } = response.body;
        expect(id).toBeDefined();
        expect(name).toEqual(user.name);
        expect(email).toEqual(user.email);
        expect(isActive).toEqual(true);
      });
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const user = {
      name: 'Test',
      email: 'test@test2.com',
      password: 'password',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(201);

    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(user.email);
  });
});
