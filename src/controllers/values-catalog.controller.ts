import {
  Body,
  Controller,
  Post,
  UseGuards,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ValuesCatalogService } from '../services/values-catalog.service';
import { ValuesCatalogEntity } from '../entities/values-catalog.entity';
import { RequestValueCatalogDto } from '../dto/request/request-value-catalog.dto';
import express from 'express';

@ApiTags('values-catalog')
@ApiBearerAuth()
@Controller('v1/values-catalog')
export class ValuesCatalogController {
  constructor(private readonly valuesCalatogService: ValuesCatalogService) {}

  /**
   * API get value Catalog
   * @param parameters
   * @param response
   */
  @ApiOperation({
    summary: 'API get value Catalog',
  })
  @ApiBadRequestResponse({
    description:
      '<b>Bad Request:</b><br/>' +
      '1.- category must be a string<br/>' +
      '2.- category should not be empty',
  })
  @ApiInternalServerErrorResponse({
    description: '<b>Error Message:</b> Error in service value Catalog',
  })
  @ApiOkResponse({
    description: 'Get value Catalog successfully',
    type: ValuesCatalogEntity,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  @Post('value')
  @UsePipes(ValidationPipe)
  async getValueCatalog(
    @Body() parameters: RequestValueCatalogDto,
    @Res() response: express.Response,
  ): Promise<any> {
    return this.valuesCalatogService.getValueCatalogService(
      parameters,
      response,
    );
  }
}
