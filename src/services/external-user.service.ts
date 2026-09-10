import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { FindOptionsWhere, Repository, ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import express from 'express';
import { DateTime } from 'luxon'; // Consultado (10-2022) en: https://moment.github.io/luxon/
import { ShipmentTrackingHistoryEntity } from '../entities/shipment-tracking-history.entity';

@Injectable()
export class ExternalUserService {
  constructor(
    @InjectRepository(ShipmentTrackingHistoryEntity)
    private readonly shipmentTrackingHistoryRepository: Repository<ShipmentTrackingHistoryEntity>,
  ) {}

  /**
   * Function Shipment Tracking History
   * @param tracking_code
   * @param offset
   * @param search
   * @param limit
   * @param order
   * @param response
   */
  async shipmentTrackingHistoryService(
    tracking_code: string,
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
          guide_code: tracking_code,
        },
      };

      if (search) {
        where = [
          {
            shipment: {
              guide_code: tracking_code,
              provenance_direction: ILike(`%${search}%`),
            },
          },
          {
            shipment: {
              guide_code: tracking_code,
              destination_direction: ILike(`%${search}%`),
            },
          },
          {
            shipment: {
              guide_code: tracking_code,
              recipient_name: ILike(`%${search}%`),
            },
          },
          {
            shipment: {
              guide_code: tracking_code,
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
            insert_date: order.toUpperCase() as 'ASC' | 'DESC' | undefined,
          },
        });

      let shipment_status_name: string = '';
      const array_shipment_tracking_history: any[] = [];
      for (const shipment_tracking_history of json_shipment_tracking_history) {
        const shipment = await shipment_tracking_history.shipment;

        const status = await shipment_tracking_history.status;

        const shipment_status = await shipment.status;

        shipment_status_name = shipment_status.name;

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
            new Date(shipment_tracking_history.insert_date).toISOString(),
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
            shipment_status: shipment_status_name,
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
