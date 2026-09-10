import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestValueCatalogDto } from '../dto/request/request-value-catalog.dto';
import { ValuesCatalogEntity } from '../entities/values-catalog.entity';
import express from 'express';

@Injectable()
export class ValuesCatalogService {
  constructor(
    @InjectRepository(ValuesCatalogEntity)
    private readonly valuesCatalogRepository: Repository<ValuesCatalogEntity>,
  ) {}

  /**
   * Function get Value Catalog
   * @param parameters
   * @param response
   */
  async getValueCatalogService(
    parameters: RequestValueCatalogDto,
    @Res() response: express.Response,
  ) {
    try {
      let json_value_catalog: ValuesCatalogEntity[] | null = null;
      if (parameters.name) {
        json_value_catalog = await this.valuesCatalogRepository.find({
          where: {
            category: parameters.category,
            name: parameters.name,
            active: 1,
          },
        });
      } else {
        json_value_catalog = await this.valuesCatalogRepository.find({
          where: {
            category: parameters.category,
            active: 1,
          },
        });
      }

      response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Get value Catalog successfully',
        system_message: [],
        data: [json_value_catalog],
      });
    } catch (err) {
      console.error(err);

      const error_message =
        err instanceof Error ? err.message : 'Unexpected error';

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: 500,
        message: 'Error in service value Catalog',
        errors: [error_message],
      });
    }
  }
}
