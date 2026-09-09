import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestUserLoginDto {
  @IsNotEmpty({ message: 'email no debería estar vacío' })
  @IsString({ message: 'email debe ser una cadena de caracteres' })
  @IsEmail({}, { message: 'email es inválido' })
  @ApiProperty()
  readonly email: string;

  @IsNotEmpty({ message: 'password no debería estar vacío' })
  @IsString({ message: 'password debe ser una cadena de caracteres' })
  @ApiProperty()
  readonly password: string;
}
