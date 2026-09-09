import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUserType } from './types/auth-user.type';

@Injectable()
export class AppService {
  constructor(private readonly jwtService: JwtService) {}

  getHello(): string {
    return 'Hello World!';
  }

  /**
   * JWT Decode Authorization User
   * Consulted (09-2023) in: https://stackoverflow.com/questions/57833669/how-to-get-jwt-token-from-headers-in-controller
   * @param auth
   */
  jsonAuthUser(auth: string): AuthUserType {
    const access_token = auth.replace('Bearer ', '');
    const auth_user: AuthUserType = this.jwtService.decode(access_token, {
      json: true,
    });
    // console.log(auth_user);
    // const json_auth_user = JSON.parse(JSON.stringify(auth_user));
    // console.log(json_auth_user.user_id);
    return JSON.parse(JSON.stringify(auth_user)) as AuthUserType;
  }
}
