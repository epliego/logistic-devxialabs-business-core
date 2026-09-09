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
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import express from 'express';
import { InternalService } from '../services/internal.service';
import { ResponseEmptyDto } from '../dto/response/response-empty.dto';
import { RequestCreateInternalUserDto } from '../dto/request/request-create-internal-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestCreateShipmentDto } from '../dto/request/request-create-shipment.dto';
import { ResponseShipmentsListDto } from '../dto/response/response-shipments-list.dto';

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

  /**
   * API Create Shipment
   * @param auth
   * @param parameters
   * @param response
   */
  @ApiOperation({
    summary: 'API Create Shipment',
  })
  @ApiBadRequestResponse({
    description:
      '<b>Bad Request:</b><br/>' +
      '1.- provenance_direction must be a string<br/>' +
      '2.- destination_direction must be a string<br/>' +
      '3.- recipient_name must be a string<br/>' +
      '4.- weight_kg must be a number conforming to the specified constraints<br/>' +
      '5.- User does not have permissions to create shipment',
  })
  @ApiInternalServerErrorResponse({
    description: '<b>Error Message:</b> Error in service Create Shipment',
  })
  @ApiCreatedResponse({
    description: 'Create Shipment successfully',
    type: ResponseEmptyDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  @Post('shipments')
  @UsePipes(ValidationPipe)
  async createShipment(
    @Headers('Authorization') auth: string, // Consulted (09-2023) in: https://stackoverflow.com/questions/54081720/how-to-use-nest-jss-headers-properly
    @Body() parameters: RequestCreateShipmentDto,
    @Res() response: express.Response,
  ): Promise<any> {
    return this.internalService.createShipmentService(
      auth,
      parameters,
      response,
    );
  }

  /**
   * API Shipments List
   * @param status_id
   * @param offset
   * @param search
   * @param limit
   * @param order
   * @param response
   */
  @ApiOperation({
    summary: 'API Shipments List',
  })
  @ApiInternalServerErrorResponse({
    description: '<b>Error Message:</b> Error in service Shipments List',
  })
  @ApiOkResponse({
    description: 'Shipments List successfully',
    type: ResponseShipmentsListDto,
  })
  @ApiQuery({ name: 'status_id', required: false, type: String })
  @ApiQuery({ name: 'offset', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, type: String })
  @UseGuards(AuthGuard('jwt'))
  @Get('shipments')
  @UsePipes(ValidationPipe)
  async shipmentsList(
    @Query('status_id') status_id: string = '',
    @Query('offset') offset: string,
    @Query('search') search: string,
    @Query('limit') limit: string,
    @Query('order') order: string,
    @Res() response: express.Response,
  ): Promise<any> {
    return this.internalService.shipmentsListService(
      status_id,
      offset,
      search,
      limit,
      order,
      response,
    );
  }
}
