import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserLoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsIn...' })
  readonly access_token: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '60s' })
  readonly access_token_expires_in: string;
}
