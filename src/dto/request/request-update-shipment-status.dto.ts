import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestUpdateShipmentStatusDto {
  @IsNotEmpty({ message: 'status_id no debería estar vacío' })
  @IsNumber(
    {},
    {
      message:
        'status_id debe ser un número que cumpla con las restricciones especificadas',
    },
  )
  @ApiProperty()
  readonly status_id: number;
}
