import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppDataSource } from '../data-source';
import { DataSource } from 'typeorm';
import { JwtInternalAccessTokenStrategy } from './strategies/jwt-internal-access-token.strategy';
import type { StringValue } from 'ms';
import { InternalUserEntity } from './entities/internal-user.entity';
import { InternalUserByProfileEntity } from './entities/internal-user-by-profile.entity';
import { InternalUserProfileEntity } from './entities/internal-user-profile.entity';
import { ShipmentEntity } from './entities/shipment.entity';
import { ValuesCatalogEntity } from './entities/values-catalog.entity';
import { ShipmentTrackingHistoryEntity } from './entities/shipment-tracking-history.entity';
import { InternalUserController } from './controllers/internal-user.controller';
import { InternalUserService } from './services/internal-user.service';
import { config } from 'dotenv';

config();

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forFeature([
      InternalUserEntity,
      InternalUserByProfileEntity,
      InternalUserProfileEntity,
      ValuesCatalogEntity,
      ShipmentEntity,
      ShipmentTrackingHistoryEntity,
    ]),
    JwtModule.register({
      secret: process.env.INTERNAL_SECRET_ACCESS_TOKEN,
      signOptions: {
        expiresIn: process.env.INTERNAL_ACCESS_TOKEN_EXPIRES_IN as
          number | StringValue,
      },
    }),
    PassportModule,
  ],
  controllers: [AppController, InternalUserController],
  providers: [
    AppService,
    JwtInternalAccessTokenStrategy,
    InternalUserService,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
