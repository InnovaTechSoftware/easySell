import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';

import * as bcryptjs from 'bcryptjs'
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

    constructor(private readonly usersService: UsersService) { }

    async login({ user, password }: LoginDto) {
        const userfound = await this.usersService.findOneByUser(user)
        if (!userfound) {
            return new HttpException('User not found', HttpStatus.NOT_FOUND)
        }

        const passwordHash = await bcryptjs.compare(password, userfound.password)
        if (!passwordHash) {
            return new HttpException('Wrong password', HttpStatus.UNAUTHORIZED)
        }

        return userfound;

    }
    async register({ name, lastname, documentType, document, user, password }: RegisterDto) {

        const usercreate = await this.usersService.findOneByUser(user)

        if (usercreate) {
            return new HttpException('User already exists', HttpStatus.CONFLICT)
        }

        return await this.usersService.create({

            name,
            lastname,
            documentType,
            document,
            user,
            password: await bcryptjs.hash(password, 10)
        });
    }

}
