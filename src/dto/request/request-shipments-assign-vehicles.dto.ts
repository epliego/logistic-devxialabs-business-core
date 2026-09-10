import { IsNotEmpty, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestShipmentsAssignVehiclesDto {
  @IsNotEmpty({ message: 'provenance_direction no debería estar vacío' })
  @IsArray({
    message: 'shipment_ids debe ser un arreglo',
  })
  @ApiProperty({
    isArray: true,
    example: ['uuid-1', 'uuid-2', 'uuid-3'],
  })
  readonly shipment_ids: any;

  @IsNotEmpty({ message: 'vehicle_capacity no debería estar vacío' })
  @IsNumber(
    {},
    {
      message:
        'vehicle_capacity debe ser un número que cumpla con las restricciones especificadas',
    },
  )
  @ApiProperty()
  readonly vehicle_capacity: number;
}
