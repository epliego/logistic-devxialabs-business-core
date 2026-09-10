import {
  Controller,
  Res,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import express from 'express';
import { ExternalUserService } from '../services/external-user.service';
import { ResponseShipmentStatusTrackingHistoryDto } from '../dto/response/response-shipment-status-tracking-history.dto';

@ApiTags('external-user')
@ApiBearerAuth()
@Controller('v1/external-user')
export class ExternalUserController {
  constructor(private readonly externaluserService: ExternalUserService) {}

  /**
   * API Shipment Tracking History
   * @param tracking_code
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
    type: ResponseShipmentStatusTrackingHistoryDto,
  })
  @ApiQuery({ name: 'offset', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, type: String })
  @Get('tracking/:tracking_code')
  async shipmentTrackingHistory(
    @Param('tracking_code') tracking_code: string,
    @Query('offset') offset: string,
    @Query('search') search: string,
    @Query('limit') limit: string,
    @Query('order') order: string,
    @Res() response: express.Response,
  ): Promise<any> {
    return this.externaluserService.shipmentTrackingHistoryService(
      tracking_code,
      offset,
      search,
      limit,
      order,
      response,
    );
  }
}
