import {
  Body,
  Controller,
  Post,
  Res,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import express from 'express';
import { InternalUserService } from '../services/internal-user.service';
import { RequestUserLoginDto } from '../dto/request/request-user-login.dto';
import { ResponseUserLoginDto } from '../dto/response/response-user-login.dto';

@ApiTags('internal-user')
@ApiBearerAuth()
@Controller('v1/internal-user')
export class InternalUserController {
  constructor(private readonly internalUserService: InternalUserService) {}

  /**
   * API Authenticate user and obtain access token to DevxIA Labs Logistic APIs
   * @param user
   * @param response
   */
  @ApiOperation({
    summary:
      'Authenticate user and obtain access token to DevxIA Labs Logistic APIs',
  })
  @ApiBadRequestResponse({
    description:
      '<b>Bad Request:</b><br/>' +
      '1.- Incorrect email and / or password. Please check and try again<br/>' +
      '2.- Inactive email. Please contact the System administrator<br/>' +
      '3.- User does not have a profile assigned',
  })
  @ApiOkResponse({
    description: 'Authentication successfully',
    type: ResponseUserLoginDto,
  })
  @Post('auth/login')
  @UsePipes(ValidationPipe)
  async login(
    @Body() user: RequestUserLoginDto,
    @Res() response: express.Response,
  ): Promise<any> {
    await this.internalUserService
      .loginService(user)
      .then((login) => {
        response.status(HttpStatus.OK).json(login);
      })
      .catch((error) => {
        const error_message =
          error instanceof Error ? error.message : 'Unexpected error';

        response.status(HttpStatus.UNAUTHORIZED).json({ error_message });
      });
  }
}
