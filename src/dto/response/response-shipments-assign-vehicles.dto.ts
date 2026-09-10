import { IsNotEmpty, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseShipmentsAssignVehiclesDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    isArray: true,
    example: [
      {
        vehicle_number: 0,
        shipments: [
          {
            shipment_id: 'string',
            tracking_code: 'string',
            weight_kg: 0,
          },
        ],
        total_weight_kg: 0,
        remaining_capacity: 0,
      },
    ],
  })
  readonly vehicles: any;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly total_vehicles_used: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly total_weight_kg: number;
}
