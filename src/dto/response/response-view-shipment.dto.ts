import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseViewShipmentDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly shipment_id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly guide_code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly provenance_direction: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly destination_direction: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly recipient_name: string;

  @IsOptional() // Consulted (05-2023) in: https://stackoverflow.com/questions/75172042/prevent-null-value-on-nestjs-dto-properties
  @ApiProperty()
  readonly recipient_phone: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly weight_kg: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly status: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'DD/MM/YYYY HH:SS' })
  readonly insert_date: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly insert_by_internal: string;
}
