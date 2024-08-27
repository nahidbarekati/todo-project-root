import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@todo-service/app.module';

describe('TodoItemController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/todo-items/:id/priority (PATCH)', async () => {
    const id = 'test-id';
    const priority = 1;

    const response = await request(app.getHttpServer())
      .patch(`/todo-items/${id}/priority`)
      .send({ priority })
      .expect(200);

    expect(response.body.message).toBe('Priority updated successfully');
  });

  afterAll(async () => {
    await app.close();
  });
});
