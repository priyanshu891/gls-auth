import { Injectable, Inject, Logger, RequestTimeoutException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { compareSync } from 'bcrypt';
import { timeout, catchError } from 'rxjs/operators';
import { throwError, TimeoutError } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(@Inject('USER_CLIENT') private readonly client: ClientProxy, private readonly jwtService: JwtService) { }

    async validateUser(email: string, password: string): Promise<any> {
        try {
            const user = await this.client.send({ role: 'user', cmd: 'get' }, { email }).pipe(timeout(5000), catchError(err => {
                if (err instanceof TimeoutError) {
                    return throwError(new RequestTimeoutException());
                }
                return throwError(err);
            })).toPromise();

            if (user) {
                if (compareSync(password, user?.password)) {
                    return user;
                }
            }
            return null;
        } catch (e) {
            Logger.log(e);
            throw e;
        }
    }

    async login(user) {
        const payload = { sub: user._id };

        const entity = {
            role: user.role,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            createdAt: user.createdAt
        }
        return {
            entity,
            accessToken: this.jwtService.sign(payload)
        };
    }

    validateToken(jwt: string) {
        const payload = this.jwtService.verify(jwt);
        return payload;
    }
}
