import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestCreateShipmentDto {
  @IsNotEmpty({ message: 'provenance_direction no debería estar vacío' })
  @IsString({
    message: 'provenance_direction debe ser una cadena de caracteres',
  })
  @ApiProperty()
  readonly provenance_direction: string;

  @IsNotEmpty({ message: 'destination_direction no debería estar vacío' })
  @IsString({
    message: 'destination_direction debe ser una cadena de caracteres',
  })
  @ApiProperty()
  readonly destination_direction: string;

  @IsNotEmpty({ message: 'recipient_name no debería estar vacío' })
  @IsString({ message: 'recipient_name debe ser una cadena de caracteres' })
  @ApiProperty()
  readonly recipient_name: string;

  @IsOptional() // Consulted (05-2023) in: https://stackoverflow.com/questions/75172042/prevent-null-value-on-nestjs-dto-properties
  @ApiProperty()
  readonly recipient_phone: string;

  @IsNotEmpty({ message: 'weight_kg no debería estar vacío' })
  @IsNumber(
    {},
    {
      message:
        'weight_kg debe ser un número que cumpla con las restricciones especificadas',
    },
  )
  @ApiProperty()
  readonly weight_kg: number;
}
