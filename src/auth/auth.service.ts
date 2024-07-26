import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';

import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ user, password }: LoginDto) {
    const userfound = await this.usersService.findByUserWithPassword(user);
    if (!userfound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const passwordHash = await bcryptjs.compare(password, userfound.password);
    if (!passwordHash) {
      return new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
    }

    const payload = { user: userfound.user, role: userfound.role };
    return this.generateTokens(payload);
  }
  async register({
    name,
    lastname,
    documentType,
    document,
    user,
    password,
  }: RegisterDto) {
    const usercreate = await this.usersService.findOneByUser(user);

    if (usercreate) {
      return new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    await this.usersService.create({
      name,
      lastname,
      documentType,
      document,
      user,
      password: await bcryptjs.hash(password, 10),
    });

    return {
      name: `${name} ${lastname}`,
      user,
    };
  }

  async profile({ user, role }: { user: string; role: string }) {
    return await this.usersService.findOneByUser(user);
  }

  async refreshTokens (refreshToken: string){
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      return this.generateTokens({ user: payload.user, role: payload.role}); 
    } catch (e) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  private async generateTokens (payload: any){
    const accessToken = await this.jwtService.signAsync(payload,{
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload,{
      expiresIn: '7d',
    });

    return {accessToken, refreshToken};
  }
}
