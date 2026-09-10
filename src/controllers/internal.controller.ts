import {
  Body,
  Controller,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
  Headers,
  UseGuards,
  Get,
  Query,
  Param,
  Patch,
  Delete,
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
import { ResponseViewShipmentDto } from '../dto/response/response-view-shipment.dto';
import { RequestUpdateShipmentStatusDto } from '../dto/request/request-update-shipment-status.dto';
import { ResponseShipmentTrackingHistoryDto } from '../dto/response/response-shipment-tracking-history.dto';

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

  /**
   * API View Shipment
   * @param id
   * @param response
   */
  @ApiOperation({
    summary: 'API View Shipment',
  })
  @ApiBadRequestResponse({
    description: '<b>Bad Request:</b><br/>' + '1.- Shipment ID was not found',
  })
  @ApiInternalServerErrorResponse({
    description: '<b>Error Message:</b> Error in service View Shipment',
  })
  @ApiOkResponse({
    description: 'View Shipment successfully',
    type: ResponseViewShipmentDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  @Get('shipments/:id')
  async viewShipment(
    @Param('id') id: number,
    @Res() response: express.Response,
  ): Promise<any> {
    return this.internalService.viewShipmentService(id, response);
  }

  /**
   * API Shipment Tracking History
   * @param shipment_id
   * @param offset
   * @param search
   * @param limit
   * @param order
   * @param response
   */
  @ApiOperation({
    summary: 'API Shipment Tracking History',
  })
  @ApiInternalServerErrorResponse({
    description:
      '<b>Error Message:</b> Error in service Shipment Tracking History',
  })
  @ApiOkResponse({
    description: 'Shipment Tracking History successfully',
    type: ResponseShipmentTrackingHistoryDto,
  })
  @ApiQuery({ name: 'offset', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, type: String })
  @UseGuards(AuthGuard('jwt'))
  @Get('shipment-tracking-history/:shipment_id')
  async shipmentTrackingHistory(
    @Param('shipment_id') shipment_id: number,
    @Query('offset') offset: string,
    @Query('search') search: string,
    @Query('limit') limit: string,
    @Query('order') order: string,
    @Res() response: express.Response,
  ): Promise<any> {
    return this.internalService.shipmentTrackingHistoryService(
      shipment_id,
      offset,
      search,
      limit,
      order,
      response,
    );
  }

  /**
   * API Update Shipment Status
   * @param auth
   * @param id
   * @param parameters
   * @param response
   */
  @ApiOperation({
    summary: 'API Update Shipment Status',
  })
  @ApiBadRequestResponse({
    description:
      '<b>Bad Request:</b><br/>' +
      '1.- status_id must be a number conforming to the specified constraints<br/>' +
      '2.- Shipment ID was not found',
  })
  @ApiInternalServerErrorResponse({
    description:
      '<b>Error Message:</b> Error in service Update Shipment Status',
  })
  @ApiOkResponse({
    description: 'Shipment status updated successfully',
    type: ResponseEmptyDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  @Patch('shipments/:id/status')
  @UsePipes(ValidationPipe)
  async updateShipmentStatus(
    @Headers('Authorization') auth: string, // Consulted (09-2023) in: https://stackoverflow.com/questions/54081720/how-to-use-nest-jss-headers-properly
    @Param('id') id: number,
    @Body() parameters: RequestUpdateShipmentStatusDto,
    @Res() response: express.Response,
  ): Promise<any> {
    return this.internalService.updateShipmentStatusService(
      auth,
      id,
      parameters,
      response,
    );
  }

  /**
   * API Cancel Shipment
   * @param auth
   * @param id
   * @param response
   */
  @ApiOperation({
    summary: 'API Cancel Shipment',
  })
  @ApiBadRequestResponse({
    description:
      '<b>Bad Request:</b><br/>' +
      '1.- Shipment ID was not found<br/>' +
      '2.- Shipment cannot be cancelled because it has already delivered',
  })
  @ApiInternalServerErrorResponse({
    description: '<b>Error Message:</b> Error in service Cancel Shipment',
  })
  @ApiOkResponse({
    description: 'Shipment cancelled successfully',
    type: ResponseEmptyDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  @Delete('shipments/:id')
  @UsePipes(ValidationPipe)
  async cancelShipment(
    @Headers('Authorization') auth: string, // Consulted (09-2023) in: https://stackoverflow.com/questions/54081720/how-to-use-nest-jss-headers-properly
    @Param('id') id: number,
    @Res() response: express.Response,
  ): Promise<any> {
    return this.internalService.cancelShipmentService(auth, id, response);
  }
}
