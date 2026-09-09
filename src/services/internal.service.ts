import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { In, Not, Repository, ILike, LessThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import express from 'express';
import { AppService } from '../app.service';
import crypto from 'crypto';
import { DateTime } from 'luxon'; // Consultado (10-2022) en: https://moment.github.io/luxon/
import { InternalUserEntity } from '../entities/internal-user.entity';
import { InternalUserProfileEntity } from '../entities/internal-user-profile.entity';
import { InternalUserByProfileEntity } from '../entities/internal-user-by-profile.entity';
import { RequestCreateInternalUserDto } from '../dto/request/request-create-internal-user.dto';
import { RequestCreateShipmentDto } from '../dto/request/request-create-shipment.dto';
import { ShipmentEntity } from '../entities/shipment.entity';
import { ValuesCatalogEntity } from '../entities/values-catalog.entity';
import { ShipmentTrackingHistoryEntity } from '../entities/shipment-tracking-history.entity';

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
    @InjectRepository(ShipmentEntity)
    private readonly shipmentRepository: Repository<ShipmentEntity>,
    @InjectRepository(ValuesCatalogEntity)
    private readonly valuesCatalogRepository: Repository<ValuesCatalogEntity>,
    @InjectRepository(ShipmentTrackingHistoryEntity)
    private readonly shipmentTrackingHistoryRepository: Repository<ShipmentTrackingHistoryEntity>,
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

  /**
   * Function Create Shipment
   * @param auth
   * @param parameters
   * @param response
   */
  async createShipmentService(
    auth: string,
    parameters: RequestCreateShipmentDto,
    @Res() response: express.Response,
  ) {
    try {
      const array_errors_message: any[] = [];

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
          'Usuario no tiene permisos para crear un envío',
        );
      }

      if (array_errors_message.length > 0) {
        response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: 400,
          message: 'Bad Request',
          errors: array_errors_message,
        });
      } else {
        const json_value_catalog = await this.valuesCatalogRepository.findOne({
          where: {
            category: 'SHIPMENT STATUS',
            name: 'REGISTRADO',
          },
        });

        const json_internal_user = await this.internalUserRepository.findOne({
          where: {
            id: json_auth_user.user_id,
          },
        });

        const shipment_created = await this.shipmentRepository
          .createQueryBuilder()
          .insert()
          .into(ShipmentEntity)
          .values({
            guide_code: 'ENV-YYYYMMDD-0000',
            provenance_direction: parameters.provenance_direction,
            destination_direction: parameters.destination_direction,
            recipient_name: parameters.recipient_name,
            recipient_phone: parameters.recipient_phone || null,
            weight_kg: parameters.weight_kg,
            status: { id: json_value_catalog!.id } as any,
            insert_by_internal: { id: json_internal_user!.id } as any,
          })
          .execute();

        const shipment_id_created =
          shipment_created.identifiers?.[0]?.id ??
          shipment_created.generatedMaps?.[0]?.id ??
          shipment_created.raw?.[0]?.id;

        await this.shipmentRepository
          .createQueryBuilder()
          .update(ShipmentEntity)
          .set({
            guide_code:
              'ENV-' +
              DateTime.fromISO(new Date().toISOString())
                .setLocale('es')
                .toFormat('yyyyMMdd') +
              '-' +
              shipment_id_created.toString().padStart(4, '0'),
          })
          .where('id = :id', {
            id: shipment_id_created,
          })
          .execute();

        await this.shipmentTrackingHistoryRepository
          .createQueryBuilder()
          .insert()
          .into(ShipmentTrackingHistoryEntity)
          .values({
            shipment: { id: shipment_id_created } as any,
            status: { id: json_value_catalog!.id } as any,
            insert_by_internal: { id: json_internal_user!.id } as any,
          })
          .execute();

        response.status(HttpStatus.CREATED).json({
          statusCode: 201,
          message: 'Create Shipment successfully',
          system_message: ['Envío creado satisfactoriamente'],
          data: [],
        });
      }
    } catch (err) {
      console.error(err);

      const error_message =
        err instanceof Error ? err.message : 'Unexpected error';

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: 500,
        message: 'Error in service Create Shipment',
        errors: [error_message],
      });
    }
  }
}
