import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';

import * as bcryptjs from 'bcryptjs'

@Injectable()
export class AuthService {

    constructor(private readonly usersService: UsersService)
    {}

    login(){
        return 'login';
    }
    async register({name, lastname, documentType, document, user, password}: RegisterDto){
        
        const usercreate = await this.usersService.findOneByUser(user)

        if(usercreate){
            return new HttpException('User already exists', HttpStatus.CONFLICT)
        }
        
        return await this.usersService.create({
            
            name,
            lastname,
            documentType,
            document,
            user,
            password: await bcryptjs.hash(password,10)
        });
    }

}
