import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import process from 'process';
import type { StringValue } from 'ms';
import { JwtService } from '@nestjs/jwt';
import { InternalService } from '../src/services/internal.service';
import express from 'express';

// Execute commands for getting coverage npm run test:e2e -- --clearCache and then npm run test:e2e -- --coverage
describe('InternalController (e2e)', () => {
  let app: INestApplication<App>;
  let jwt_service: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(InternalService)
      .useValue({
        createInternalUserService: jest
          .fn()
          .mockImplementation(
            (_auth, _parameters, response: express.Response) => {
              response.status(201).json({
                statusCode: 201,
                message: 'Create Internal User successfully',
                system_message: [],
                data: [],
              });
            },
          ),
        createShipmentService: jest
          .fn()
          .mockImplementation(
            (_auth, _parameters, response: express.Response) => {
              response.status(201).json({
                statusCode: 201,
                message: 'Create Shipment successfully',
                system_message: [],
                data: [],
              });
            },
          ),
      })
      .compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    jwt_service = moduleFixture.get<JwtService>(JwtService);
  });

  const getOptionsAccessToken = () => {
    return {
      secret: process.env.INTERNAL_SECRET_ACCESS_TOKEN,
      expiresIn: process.env.INTERNAL_ACCESS_TOKEN_EXPIRES_IN as
        number | StringValue,
    };
  };

  it('/v1/internal/auth/register (POST) - with valid body', async () => {
    const payload = {
      user_id: 1,
      user_email: 'admin@logisticdeviaxlabs.com',
      user_name: 'Admin DevxIA Labs',
      user_profile_name: 'Supervisor',
    };

    const access_token = jwt_service.sign(payload, getOptionsAccessToken());

    const response = await request(app.getHttpServer())
      .post('/v1/internal/auth/register')
      .set('Authorization', 'Bearer ' + access_token)
      .send({
        email: 'email@email.com',
        name: 'Name Last-Name',
        password: '123456',
        profile_id: 2, // Operador = 2
      });
    // console.log(response);

    expect(response.statusCode).toBe(201);
  });

  it('/v1/internal/auth/register (POST) - with no body', async () => {
    const payload = {
      user_id: 1,
      user_email: 'admin@logisticdeviaxlabs.com',
      user_name: 'Admin DevxIA Labs',
      user_profile_name: 'Supervisor',
    };

    const access_token = jwt_service.sign(payload, getOptionsAccessToken());

    const response = await request(app.getHttpServer())
      .post('/v1/internal/auth/register')
      .set('Authorization', 'Bearer ' + access_token);
    // console.log(response);

    expect(response.statusCode).toBe(400);

    const array_messages = [
      'email es inválido',
      'email debe ser una cadena de caracteres',
      'email no debería estar vacío',
      'name debe ser una cadena de caracteres',
      'name no debería estar vacío',
      'password debe ser una cadena de caracteres',
      'password no debería estar vacío',
      'profile_id debe ser un número que cumpla con las restricciones especificadas',
      'profile_id no debería estar vacío',
    ];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const array_messages_body: any[] = response.body.message;

    expect(array_messages.length).toBe(array_messages_body.length);

    expect(array_messages).toEqual(expect.arrayContaining(array_messages_body));
  });

  it('/v1/internal/shipments (POST) - with valid body', async () => {
    const payload = {
      user_id: 3,
      user_email: 'epm.eduardo@gmail.com.com',
      user_name: 'Eduardo Pliego Meré',
      user_profile_name: 'Operador',
    };

    const access_token = jwt_service.sign(payload, getOptionsAccessToken());

    const response = await request(app.getHttpServer())
      .post('/v1/internal/shipments')
      .set('Authorization', 'Bearer ' + access_token)
      .send({
        provenance_direction: 'Dirección detinatario',
        destination_direction: 'Dirección destino',
        recipient_name: 'Nombre completo',
        weight_kg: 5,
      });
    // console.log(response);

    expect(response.statusCode).toBe(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
