import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
// import { jwtConstants } from './constans/jwt.constans';
import {TokenService} from '../auth/token.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService]
})
export class AuthModule {}
