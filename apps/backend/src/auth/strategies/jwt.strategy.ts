/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the configuration');
    }

    console.log(
      'Auth service using JWT secret (first 4 chars):',
      jwtSecret?.substring(0, 4) + '...',
    );

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
    console.log('JWT Strategy initialized with secret from config');
  }

  validate(payload: any) {
    // Log payload for debugging
    console.log('JWT Payload received:', {
      sub: payload.sub,
      username: payload.username,
      roles: payload.roles,
    });

    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
