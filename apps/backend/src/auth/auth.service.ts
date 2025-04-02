import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(loginDto: { username: string; password: string }) {
    // Replace with actual user validation logic
    const payload = { username: loginDto.username, sub: 1 };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
