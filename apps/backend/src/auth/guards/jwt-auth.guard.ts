/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment*/
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add token debugging here
    const request = context.switchToHttp().getRequest();
    console.log('Auth Debug - Headers:', request.headers);
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      console.log('JWT Auth Error:', err?.message || 'No user found');
      console.log('JWT Info:', info?.message);
      throw err || new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}
