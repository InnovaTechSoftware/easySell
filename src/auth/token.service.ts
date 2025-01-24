import {Injectable} from "@nestjs/common";
import exp from "constants";
import {JwtService} from "@nestjs/jwt";


@Injectable()
export class TokenService {
    
    constructor(
        private jwtService: JwtService
    ) {}

    async generateAccessToken(payload:any): Promise<string>{
        return this.jwtService.signAsync(payload,{
            secret: process.env.SECRET,
            expiresIn: '15m'
        });
    }

    async generateRefreshToken(payload:any): Promise<string>{
        return this.jwtService.signAsync(payload,{
            secret: process.env.SECRET,
            expiresIn: '7d'
        });
    }

    async verifyRefreshToken(refreshToken: string): Promise<any>{

        return this.jwtService.verifyAsync(refreshToken,{
            secret: process.env.SECRET
        });
    }

}