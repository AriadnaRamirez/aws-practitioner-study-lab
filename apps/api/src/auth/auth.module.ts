import '../load-env';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GuestModule } from '../guest/guest.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: process.env.JWT_SECRET ?? 'dev-only-insecure-jwt-secret',
        signOptions: {
          expiresIn: (process.env.JWT_EXPIRES_IN ??
            '7d') as `${number}${'s' | 'm' | 'h' | 'd'}`,
        },
      }),
    }),
    GuestModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
