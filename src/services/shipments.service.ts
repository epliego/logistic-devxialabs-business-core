import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import express from 'express';
import { ShipmentEntity } from '../entities/shipment.entity';
import { RequestShipmentsAssignVehiclesDto } from '../dto/request/request-shipments-assign-vehicles.dto';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(ShipmentEntity)
    private readonly shipmentRepository: Repository<ShipmentEntity>,
  ) {}

  /**
   * Function Shipments Assign Vehicles
   * @param parameters
   * @param response
   */
  async shipmentAssignVehiclesService(
    parameters: RequestShipmentsAssignVehiclesDto,
    @Res() response: express.Response,
  ): Promise<any> {
    try {
      const json_shipments = await this.shipmentRepository.find({
        relations: { status: true },
        where: {
          guide_code: In(parameters.shipment_ids),
          status: {
            name: 'EN ALMACÉN',
          },
        },
        order: {
          weight_kg: 'DESC',
        },
      });

      let vehicle_number: number = 0;
      let total_weight_kg: number = 0;
      const array_messages: any[] = [];
      const array_vehicles: any[] = [];
      let array_shipments: any[] = [];
      for (const shipment of json_shipments) {
        if (Number(shipment.weight_kg) > parameters.vehicle_capacity) {
          array_messages.push(
            'El envío ' +
              shipment.guide_code +
              ' supera la capacidad del vehículo',
          );
        } else {
          array_shipments.push({
            shipment_id: shipment.id,
            tracking_code: shipment.guide_code,
            weight_kg: Number(shipment.weight_kg),
          });

          total_weight_kg = total_weight_kg + Number(shipment.weight_kg);

          if (total_weight_kg >= parameters.vehicle_capacity) {
            vehicle_number = vehicle_number + 1;

            let shipments = array_shipments;
            let total_weight = total_weight_kg;
            let remaining_capacity =
              parameters.vehicle_capacity - total_weight_kg;
            if (total_weight_kg > parameters.vehicle_capacity) {
              shipments = array_shipments.slice(0, -1);

              total_weight = total_weight_kg - Number(shipment.weight_kg);

              remaining_capacity =
                parameters.vehicle_capacity -
                (total_weight_kg - Number(shipment.weight_kg));

              total_weight_kg = Number(shipment.weight_kg);
              array_shipments = [];
              array_shipments.push({
                shipment_id: shipment.id,
                tracking_code: shipment.guide_code,
                weight_kg: Number(shipment.weight_kg),
              });
            } else {
              total_weight_kg = 0;
              array_shipments = [];
            }

            array_vehicles.push({
              vehicle_number: vehicle_number,
              shipments: shipments,
              total_weight_kg: total_weight,
              remaining_capacity: remaining_capacity,
            });
          }
        }
      }

      if (
        total_weight_kg <= parameters.vehicle_capacity &&
        array_shipments.length > 0
      ) {
        array_vehicles.push({
          vehicle_number: vehicle_number + 1,
          shipments: array_shipments,
          total_weight_kg: total_weight_kg,
          remaining_capacity: parameters.vehicle_capacity - total_weight_kg,
        });
      }

      let total_weight_kg_used = 0;
      for (const vehicle of array_vehicles) {
        total_weight_kg_used = total_weight_kg_used + vehicle.total_weight_kg;
      }

      response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Shipments Assign Vehicles successfully',
        data: [
          {
            vehicles: array_vehicles,
            total_vehicles_used: array_vehicles.length,
            total_weight_kg: total_weight_kg_used,
            messages: array_messages,
          },
        ],
      });
    } catch (err) {
      console.error(err);

      const error_message =
        err instanceof Error ? err.message : 'Unexpected error';

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: 500,
        message: 'Error in service Shipments Assign Vehicles',
        errors: [error_message],
      });
    }
  }
}
