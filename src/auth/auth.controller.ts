import { Controller, Post, Request, UseGuards, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('auth')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @MessagePattern({ role: 'auth', cmd: 'check' })
    async loggedIn(data) {
        try {
            const res = this.authService.validateToken(data.jwt);
            console.log("Hiii", res);
            return res;
        } catch (e) {
            const errObj: Error = {
                name: "",
                message: "",
            }

            if (e instanceof Error) {
                errObj.name = e.name;
                errObj.message = e.message
                console.log(errObj)
            }
            return new Error(errObj.message);
        }
    }
}
