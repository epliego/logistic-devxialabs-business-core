import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestUserLoginDto {
  @IsNotEmpty({ message: '{property} no debería estar vacío' })
  @IsString({ message: '{property} debe ser una cadena de caracteres' })
  @IsEmail({}, { message: 'email es inválido' })
  @ApiProperty()
  readonly email: string;

  @IsNotEmpty({ message: '{property} no debería estar vacío' })
  @IsString({ message: '{property} debe ser una cadena de caracteres' })
  @ApiProperty()
  readonly password: string;
}
