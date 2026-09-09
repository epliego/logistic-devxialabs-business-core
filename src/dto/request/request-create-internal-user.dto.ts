import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestCreateInternalUserDto {
  @IsNotEmpty({ message: 'email no debería estar vacío' })
  @IsString({ message: 'email debe ser una cadena de caracteres' })
  @IsEmail({}, { message: 'email es inválido' })
  @ApiProperty()
  readonly email: string;

  @IsNotEmpty({ message: 'name no debería estar vacío' })
  @IsString({ message: 'name debe ser una cadena de caracteres' })
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty({ message: 'password no debería estar vacío' })
  @IsString({ message: 'password debe ser una cadena de caracteres' })
  @ApiProperty()
  readonly password: string;

  @IsNotEmpty({ message: 'profile_id no debería estar vacío' })
  @IsNumber(
    {},
    {
      message:
        'profile_id debe ser un número que cumpla con las restricciones especificadas',
    },
  )
  @ApiProperty()
  readonly profile_id: number;
}
