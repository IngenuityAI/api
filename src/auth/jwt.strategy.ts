import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ApplicationConfig } from 'src/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,

      issuer: ApplicationConfig.keycloak.issuer,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${ApplicationConfig.keycloak.issuer}/protocol/openid-connect/certs`,
      }),
    });
  }

  async validate(payload: any) {
    /*await this.usersService.$upsertUser(
      payload.sub,
      payload.email,
      payload.name,
    );*/

    return {
      userId: payload.sub,
      email: payload.email,
      fullName: payload.name,
      roles: payload.realm_access?.roles || [],
    };
  }
}
