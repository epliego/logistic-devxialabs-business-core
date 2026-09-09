import {
  Body,
  Controller,
  Post,
  Res,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Headers,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import express from 'express';
import { InternalService } from '../services/internal.service';
import { ResponseEmptyDto } from '../dto/response/response-empty.dto';
import { RequestCreateInternalUserDto } from '../dto/request/request-create-internal-user.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('internal')
@ApiBearerAuth()
@Controller('v1/internal')
export class InternalController {
  constructor(private readonly internalService: InternalService) {}

  /**
   * API Create Internal User
   * @param auth
   * @param parameters
   * @param response
   */
  @ApiOperation({
    summary: 'API Create Internal User',
  })
  @ApiBadRequestResponse({
    description:
      '<b>Bad Request:</b><br/>' +
      "1.- User's email exists<br/>" +
      '2.- email must be an email<br/>' +
      '3.- password must be a string<br/>' +
      '4.- name must be a string<br/>' +
      '5.- profile_id must be a number conforming to the specified constraints<br/>' +
      '6.- User does not have permissions to create internal users',
  })
  @ApiInternalServerErrorResponse({
    description: '<b>Error Message:</b> Error in service Create Internal User',
  })
  @ApiCreatedResponse({
    description: 'Create Internal User successfully',
    type: ResponseEmptyDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  @Post('auth/register')
  @UsePipes(ValidationPipe)
  async createInternalUser(
    @Headers('Authorization') auth: string, // Consulted (09-2023) in: https://stackoverflow.com/questions/54081720/how-to-use-nest-jss-headers-properly
    @Body() parameters: RequestCreateInternalUserDto,
    @Res() response: express.Response,
  ): Promise<any> {
    return this.internalService.createInternalUserService(
      auth,
      parameters,
      response,
    );
  }
}
