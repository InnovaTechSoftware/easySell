import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { TokenService } from '../auth/token.service';
import { EntityManager } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async login({ user, password }: LoginDto) {
    const userfound = await this.usersService.findByUserWithPassword(user);
    if (!userfound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const passwordHash = await bcryptjs.compare(password, userfound.password);
    if (!passwordHash) {
      throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
    }

    const payload = { user: userfound.user, role: userfound.role };
    const accessToken = await this.tokenService.generateAccessToken(payload);
    const refreshToken = await this.tokenService.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }
  async register({
    name,
    lastname,
    documentType,
    document,
    phone,
    user,
    email,
    password,
  }: RegisterDto) {
    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const userRepository = transactionalEntityManager.getRepository(User);

        const usercreate = await userRepository.findOne({ where: { user } });

        if (usercreate) {
          throw new HttpException('User already exists', HttpStatus.CONFLICT);
        }

        const newUser = userRepository.create({
          name,
          lastname,
          documentType,
          document,
          phone,
          user,
          email,
          password: await bcryptjs.hash(password, 10),
        });

        await userRepository.save(newUser);

        return {
          name: `${name} ${lastname}`,
          user,
        };
      },
    );
  }

  async profile({ user, role }: { user: string; role: string }) {
    return await this.usersService.findOneByUser(user);
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.tokenService.verifyRefreshToken(refreshToken);
      return this.tokenService.generateAccessToken({
        user: payload.user,
        role: payload.role,
      });
    } catch (e) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }
}
