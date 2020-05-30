import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { ExtractJwt } from "passport-jwt";
import { jwtConstants } from "src/Utils/constants";

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret
        });
    }

    async validate(payload) {
        return { id: payload.sub, user: payload.user };
    }
}