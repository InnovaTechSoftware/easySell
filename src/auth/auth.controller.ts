import { Body, Controller, Get, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { Role } from '../common/enums/rol.enum';
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from '../common/decorators/active-user.decorators';
import { UserActivateI } from '../common/interfaces/user-active.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(
    @Body()
    loginDto: LoginDto,
  ) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  register(
    @Body()
    registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  refresh(
    @Body('refreshToken') refreshToken: string,
  ) {
    if (!refreshToken) {
      throw new HttpException('Refresh token is required', HttpStatus.BAD_REQUEST);
    }
    return this.authService.refreshTokens(refreshToken);
  }

  @Get('profile')
  @Auth(Role.Admin)
  profile(@ActiveUser() user: UserActivateI) {
    console.log(user);
    return this.authService.profile(user);
  }
}
