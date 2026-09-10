import { IsNotEmpty, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseShipmentTrackingHistoryDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    isArray: true,
    example: [
      {
        shipment_id: 0,
        guide_code: 'string',
        provenance_direction: 'string',
        destination_direction: 'string',
        recipient_phone: 'string',
        weight_kg: 'string',
        status: 'string',
        insert_date: 'DD/MM/YYYY HH:MM',
        insert_by_internal: 'string',
      },
    ],
  })
  readonly list_shipment_tracking_history: any;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly total_shipment_tracking_history: number;
}
