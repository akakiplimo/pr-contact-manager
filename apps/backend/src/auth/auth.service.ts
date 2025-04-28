/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login(loginDto: { username: string; password: string }) {
    // Find user by email
    console.log('loginDto', loginDto.username);
    const user = await this.userService.findOneByEmail(loginDto.username);

    console.log('AuthService - User found:', user);
    // Check if user exists and password is correct
    // if (!user) {
    //   console.log('AuthService - User not found or password incorrect');
    //   throw new Error('Invalid credentials');
    // }

    // Check if password matches
    // const isPasswordValid = await this.userService.validatePassword(
    //   loginDto.password,
    //   user.password,
    // );

    // if (!isPasswordValid) {
    //   console.log('AuthService - Invalid password');
    //   throw new Error('Invalid credentials');
    // }

    // Generate JWT token
    console.log('AuthService - Generating JWT token');

    // Log the user object before signing the token
    console.log('AuthService - User object:', {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      roles: user?.roles,
    });

    // Ensure user object has the necessary properties
    // if (!user.id || !user.name || !user.email || !user.roles) {
    //   console.log('AuthService - User object is missing properties');
    //   throw new Error('Invalid user object');
    // }

    // Create payload for JWT token
    const payload = {
      username: user?.name,
      email: user?.email,
      sub: user?.id,
      roles: user?.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
