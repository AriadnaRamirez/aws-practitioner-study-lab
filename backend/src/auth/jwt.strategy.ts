import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  AuthService,
  JwtPayload,
  issuedBeforePasswordChange,
} from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'dev-only-insecure-jwt-secret',
    });
  }

  /** Messages start with "Sesión" so the web app sends the student back to login. */
  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUserById(payload.sub);
    if (!user || user.bannedAt) {
      throw new UnauthorizedException('Sesión inválida');
    }
    if (issuedBeforePasswordChange(payload, user)) {
      throw new UnauthorizedException(
        'Sesión cerrada porque la contraseña cambió. Vuelve a entrar.',
      );
    }
    return user;
  }
}
