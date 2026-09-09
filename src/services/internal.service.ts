import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { In, Not, Repository, ILike, LessThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import express from 'express';
import { AppService } from '../app.service';
import { InternalUserEntity } from '../entities/internal-user.entity';
import { InternalUserProfileEntity } from '../entities/internal-user-profile.entity';
import { InternalUserByProfileEntity } from '../entities/internal-user-by-profile.entity';
import { RequestCreateInternalUserDto } from '../dto/request/request-create-internal-user.dto';
import { DateTime } from 'luxon';
import crypto from 'crypto'; // Consultado (10-2022) en: https://moment.github.io/luxon/

@Injectable()
export class InternalService {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(InternalUserEntity)
    private readonly internalUserRepository: Repository<InternalUserEntity>,
    @InjectRepository(InternalUserProfileEntity)
    private readonly internalUserProfileRepository: Repository<InternalUserProfileEntity>,
    @InjectRepository(InternalUserByProfileEntity)
    private readonly internalUserByProfileRepository: Repository<InternalUserByProfileEntity>,
  ) {}

  /**
   * Function Create Internal User
   * @param auth
   * @param parameters
   * @param response
   */
  async createInternalUserService(
    auth: string,
    parameters: RequestCreateInternalUserDto,
    @Res() response: express.Response,
  ) {
    try {
      const array_errors_message: any[] = [];

      const json_internal_user = await this.internalUserRepository.findOne({
        where: {
          email: parameters.email,
          active: LessThan(2),
        },
      });
      if (json_internal_user) {
        array_errors_message.push('El email del usuario ya existe');
      }

      const json_auth_user = this.appService.jsonAuthUser(auth);

      const json_internal_user_profile_supervisor =
        await this.internalUserProfileRepository.findOne({
          where: {
            name: 'Supervisor',
          },
          select: { name: true },
        });

      if (
        json_auth_user.user_profile_name !==
        json_internal_user_profile_supervisor!.name
      ) {
        array_errors_message.push(
          'Usuario no tiene permisos para crear usuarios internos',
        );
      }

      if (array_errors_message.length > 0) {
        response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: 400,
          message: 'Bad Request',
          errors: array_errors_message,
        });
      } else {
        const new_internal_user = new InternalUserEntity();
        new_internal_user.email = parameters.email;

        const password_sha1 = crypto
          .createHmac('sha1', 'l0g1st1c' + parameters.password + '1n73rn4l')
          .digest('hex');

        new_internal_user.password = password_sha1;
        new_internal_user.name = parameters.name;
        new_internal_user.insert_by_internal = json_auth_user.user_id;

        await this.internalUserRepository.save(new_internal_user);

        const json_internal_user_profile =
          await this.internalUserProfileRepository.findOne({
            where: {
              id: parameters.profile_id,
            },
            select: { id: true, name: true },
          });

        await this.internalUserByProfileRepository
          .createQueryBuilder()
          .insert()
          .into(InternalUserByProfileEntity)
          .values({
            user: { id: new_internal_user.id } as any,
            profile: { id: json_internal_user_profile!.id } as any,
            active: 1,
            insert_date: new Date(),
            insert_by_internal: json_auth_user.user_id,
          })
          .execute();

        response.status(HttpStatus.CREATED).json({
          statusCode: 201,
          message: 'Create Internal User successfully',
          system_message: ['Usuario fue creado en el Sistema'],
          data: [],
        });
      }
    } catch (err) {
      console.error(err);

      const error_message =
        err instanceof Error ? err.message : 'Unexpected error';

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: 500,
        message: 'Error in service Create Internal User',
        errors: [error_message],
      });
    }
  }
}
