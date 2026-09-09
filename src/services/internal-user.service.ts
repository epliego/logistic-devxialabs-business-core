import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { RequestUserLoginDto } from '../dto/request/request-user-login.dto';
import { InternalUserEntity } from '../entities/internal-user.entity';
import { InternalUserByProfileEntity } from '../entities/internal-user-by-profile.entity';
import type { StringValue } from 'ms';
import * as crypto from 'crypto';
import * as process from 'process';

@Injectable()
export class InternalUserService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(InternalUserEntity)
    private readonly internalUserRepository: Repository<InternalUserEntity>,
    @InjectRepository(InternalUserByProfileEntity)
    private readonly internalUserByProfileRepository: Repository<InternalUserByProfileEntity>,
  ) {}

  /**
   * Function to validate user in database API TeleSalud24
   * @param user
   */
  private async userValidateService(
    user: RequestUserLoginDto,
  ): Promise<InternalUserEntity | null> {
    const password_sha1 = crypto
      .createHmac('sha1', 'l0g1st1c' + user.password + '1n73rn4l')
      .digest('hex');
    // console.log(password_sha1);

    return await this.internalUserRepository.findOne({
      where: {
        email: user.email,
        password: password_sha1,
      },
    });
  }

  /**
   * Function to auth API TeleSalud24
   * @param user
   */
  public async loginService(user: RequestUserLoginDto) {
    return this.userValidateService(user).then(async (user_data) => {
      if (!user_data) {
        return {
          statusCode: 400,
          message: 'Bad Request',
          errors: [
            'Email y/o password incorrecto(s).<br/>Por favor verifica e intenta nuevamente.',
          ],
        };
      }

      if (user_data.active !== 1) {
        return {
          statusCode: 400,
          message: 'Bad Request',
          errors: [
            'Email inactivo.<br/>Por favor, contacta al administrador del Sistema.',
          ],
        };
      }

      const json_internal_user_by_profile =
        await this.internalUserByProfileRepository.findOne({
          where: {
            user: {
              id: user_data.id,
            },
          },
        });
      if (!json_internal_user_by_profile) {
        return {
          statusCode: 400,
          message: 'Bad Request',
          errors: ['El usuario no posee un perfil asignado'],
        };
      }

      const profile = await json_internal_user_by_profile.profile;

      const payload = {
        user_id: user_data.id,
        user_email: user_data.email,
        user_name: user_data.name,
        user_profile_name: profile.name,
      };
      // console.log(payload);

      const options_access_token = {
        secret: process.env.INTERNAL_SECRET_ACCESS_TOKEN,
        expiresIn: process.env.INTERNAL_ACCESS_TOKEN_EXPIRES_IN as
          number | StringValue,
      };
      const access_token = this.jwtService.sign(payload, options_access_token);

      return {
        statusCode: 200,
        message: 'Authentication successfully',
        data: [
          {
            access_token: access_token,
            access_token_expires_in:
              process.env.INTERNAL_ACCESS_TOKEN_EXPIRES_IN,
          },
        ],
      };
    });
  }
}
