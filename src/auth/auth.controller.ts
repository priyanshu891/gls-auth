import { Controller, Post, Request, UseGuards, Logger } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // ----------- Messages ---------------------------
    // Authentication Method
    @MessagePattern({ role: 'auth', cmd: 'check' })
    async loggedIn(data) {
        try {
            const res = this.authService.validateToken(data.jwt);
            return res;
        } catch (e) {
            return e;
        }
    }

    @MessagePattern({ role: 'auth', cmd: 'sign' })
    async signin(@Payload() data: any) {
        const res = this.authService.login(data)
        return res
    }

    // ----------------- End Points -----------------------
    // Login Auth Method
    @UseGuards(LocalAuthGuard)
    @Post('auth')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }
}