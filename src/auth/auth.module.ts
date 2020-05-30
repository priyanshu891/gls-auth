import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../Jwt/local.strategy';
import { JwtStrategy } from '../Jwt/jwt.strategy';
import { AuthController } from './auth.controller';
import { jwtConstants } from '../Utils/constants';

@Module({
    imports: [ClientsModule.register([{
        name: 'USER_CLIENT',
        transport: Transport.TCP,
        options: {
            host: 'localhost',
            port: 4010,
        }
    }]), JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '10m' }
    })],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule { }
