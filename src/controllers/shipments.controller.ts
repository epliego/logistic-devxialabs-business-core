import {
  Controller,
  Res,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import express from 'express';
import { ShipmentsService } from '../services/shipments.service';
import { RequestShipmentsAssignVehiclesDto } from '../dto/request/request-shipments-assign-vehicles.dto';
import { ResponseShipmentsAssignVehiclesDto } from '../dto/response/response-shipments-assign-vehicles.dto';

@ApiTags('shipments')
@ApiBearerAuth()
@Controller('v1/shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  /**
   * API Shipments Assign Vehicles
   * @param parameters
   * @param response
   */
  @ApiOperation({
    summary: 'API Shipments Assign Vehicles',
  })
  @ApiInternalServerErrorResponse({
    description:
      '<b>Error Message:</b> Error in service Shipments Assign Vehicles',
  })
  @ApiOkResponse({
    description: 'Shipments Assign Vehicles successfully',
    type: ResponseShipmentsAssignVehiclesDto,
  })
  @Post('assign-vehicles')
  @UsePipes(ValidationPipe)
  async shipmentsAssignVehicles(
    @Body() parameters: RequestShipmentsAssignVehiclesDto,
    @Res() response: express.Response,
  ): Promise<any> {
    return this.shipmentsService.shipmentAssignVehiclesService(
      parameters,
      response,
    );
  }
}
