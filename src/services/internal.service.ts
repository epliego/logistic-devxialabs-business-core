import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { FindOptionsWhere, Repository, ILike, LessThan } from 'typeorm';
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

  /**
   * Function Shipments List
   * @param status_id
   * @param offset
   * @param search
   * @param limit
   * @param order
   * @param response
   */
  async shipmentsListService(
    status_id: string,
    offset: string,
    search: string,
    limit: string,
    order: string,
    @Res() response: express.Response,
  ): Promise<any> {
    try {
      let where:
        FindOptionsWhere<ShipmentEntity> | FindOptionsWhere<ShipmentEntity>[] =
        {};
      if (status_id.trim() !== '') {
        where = {
          status: {
            id: Number(status_id.trim()),
          },
        };
      }

      if (search) {
        if (status_id.trim() !== '') {
          where = [
            {
              guide_code: ILike(`%${search}%`),
              status: {
                id: Number(status_id.trim()),
              },
            },
            {
              provenance_direction: ILike(`%${search}%`),
              status: {
                id: Number(status_id.trim()),
              },
            },
            {
              destination_direction: ILike(`%${search}%`),
              status: {
                id: Number(status_id.trim()),
              },
            },
            {
              recipient_name: ILike(`%${search}%`),
              status: {
                id: Number(status_id.trim()),
              },
            },
          ];
        } else {
          where = [
            {
              guide_code: ILike(`%${search}%`),
            },
            {
              provenance_direction: ILike(`%${search}%`),
            },
            {
              destination_direction: ILike(`%${search}%`),
            },
            {
              recipient_name: ILike(`%${search}%`),
            },
          ];
        }
      }

      const json_shipments = await this.shipmentRepository.find({
        relations: { status: true },
        where: where,
        skip: Number(offset),
        take: Number(limit),
        order: {
          guide_code: order.toUpperCase() as 'ASC' | 'DESC' | undefined,
        },
      });

      const array_shipments: any[] = [];
      for (const shipment of json_shipments) {
        const status = await shipment.status;

        const insert_by_internal = await shipment.insert_by_internal;

        array_shipments.push({
          shipment_id: shipment.id,
          guide_code: shipment.guide_code,
          provenance_direction: shipment.provenance_direction,
          destination_direction: shipment.destination_direction,
          recipient_phone: shipment.recipient_phone,
          weight_kg: Number(shipment.weight_kg),
          status: status.name,
          insert_date: DateTime.fromISO(
            new Date(shipment.insert_date).toISOString(),
          )
            .setLocale('es')
            .toFormat('dd/MM/yyyy t'),
          insert_by_internal: insert_by_internal.name,
        });
      }

      const total_shipments = await this.shipmentRepository.count({
        where: where,
      });

      response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Shipments List successfully',
        data: [
          {
            list_shipments: array_shipments,
            total_shipments: total_shipments,
          },
        ],
      });
    } catch (err) {
      console.error(err);

      const error_message =
        err instanceof Error ? err.message : 'Unexpected error';

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: 500,
        message: 'Error in service Shipments List',
        errors: [error_message],
      });
    }
  }

  /**
   * Function View Shipment
   * @param id
   * @param response
   */
  async viewShipmentService(
    id: number,
    @Res() response: express.Response,
  ): Promise<any> {
    try {
      const array_errors: any[] = [];

      const json_shipment = await this.shipmentRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!json_shipment) {
        array_errors.push('ID del Envío no fue encontrado');
      }

      if (array_errors.length > 0) {
        response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: 400,
          message: 'Bad Request',
          errors: array_errors,
        });
      } else {
        const status = await json_shipment!.status;

        const insert_by_internal = await json_shipment!.insert_by_internal;

        response.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'View Shipment successfully',
          data: [
            {
              shipment_id: json_shipment!.id,
              guide_code: json_shipment!.guide_code,
              provenance_direction: json_shipment!.provenance_direction,
              destination_direction: json_shipment!.destination_direction,
              recipient_name: json_shipment!.recipient_name,
              recipient_phone: json_shipment!.recipient_phone,
              weight_kg: json_shipment!.weight_kg,
              status: status.name,
              insert_date: DateTime.fromISO(
                new Date(json_shipment!.insert_date).toISOString(),
              )
                .setLocale('es')
                .toFormat('dd/MM/yyyy t'),
              insert_by_internal: insert_by_internal.name,
            },
          ],
        });
      }
    } catch (err) {
      console.error(err);

      const error_message =
        err instanceof Error ? err.message : 'Unexpected error';

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: 500,
        message: 'Error in service View Shipment',
        errors: [error_message],
      });
    }
  }

  /**
   * Function Shipment Tracking History
   * @param shipment_id
   * @param offset
   * @param search
   * @param limit
   * @param order
   * @param response
   */
  async shipmentTrackingHistoryService(
    shipment_id: number,
    offset: string,
    search: string,
    limit: string,
    order: string,
    @Res() response: express.Response,
  ): Promise<any> {
    try {
      let where:
        | FindOptionsWhere<ShipmentTrackingHistoryEntity>
        | FindOptionsWhere<ShipmentTrackingHistoryEntity>[] = {
        shipment: {
          id: shipment_id,
        },
      };

      if (search) {
        where = [
          {
            shipment: {
              id: shipment_id,
              guide_code: ILike(`%${search}%`),
            },
          },
          {
            shipment: {
              id: shipment_id,
              provenance_direction: ILike(`%${search}%`),
            },
          },
          {
            shipment: {
              id: shipment_id,
              destination_direction: ILike(`%${search}%`),
            },
          },
          {
            shipment: {
              id: shipment_id,
              recipient_name: ILike(`%${search}%`),
            },
          },
          {
            shipment: {
              id: shipment_id,
            },
            status: {
              name: ILike(`%${search}%`),
            },
          },
        ];
      }

      const json_shipment_tracking_history =
        await this.shipmentTrackingHistoryRepository.find({
          relations: { shipment: true, status: true },
          where: where,
          skip: Number(offset),
          take: Number(limit),
          order: {
            shipment: {
              guide_code: order.toUpperCase() as 'ASC' | 'DESC' | undefined,
            },
          },
        });

      const array_shipment_tracking_history: any[] = [];
      for (const shipment_tracking_history of json_shipment_tracking_history) {
        const shipment = await shipment_tracking_history.shipment;

        const status = await shipment_tracking_history.status;

        const insert_by_internal =
          await shipment_tracking_history.insert_by_internal;

        array_shipment_tracking_history.push({
          shipment_id: shipment.id,
          guide_code: shipment.guide_code,
          provenance_direction: shipment.provenance_direction,
          destination_direction: shipment.destination_direction,
          recipient_phone: shipment.recipient_phone,
          weight_kg: Number(shipment.weight_kg),
          status: status.name,
          insert_date: DateTime.fromISO(
            new Date(shipment.insert_date).toISOString(),
          )
            .setLocale('es')
            .toFormat('dd/MM/yyyy t'),
          insert_by_internal: insert_by_internal.name,
        });
      }

      const total_shipment_tracking_history =
        await this.shipmentTrackingHistoryRepository.count({
          where: where,
        });

      response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Shipment Tracking History successfully',
        data: [
          {
            list_shipment_tracking_history: array_shipment_tracking_history,
            total_shipment_tracking_history: total_shipment_tracking_history,
          },
        ],
      });
    } catch (err) {
      console.error(err);

      const error_message =
        err instanceof Error ? err.message : 'Unexpected error';

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: 500,
        message: 'Error in service Shipments List',
        errors: [error_message],
      });
    }
  }
}
