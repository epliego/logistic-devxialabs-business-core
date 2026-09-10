import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestValueCatalogDto {
  @IsNotEmpty({ message: 'category no debería estar vacío' })
  @IsString({ message: 'name debe ser una cadena de caracteres' })
  @ApiProperty()
  readonly category: string;

  @IsOptional() // Consulted (05-2023) in: https://stackoverflow.com/questions/75172042/prevent-null-value-on-nestjs-dto-properties
  @ApiProperty()
  readonly name: string;
}
