import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterDto } from './dto/register.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AUTH_LIMITS, ClientIp, RateLimiter } from './rate-limit';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly limiter: RateLimiter,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registro con correo + usuario + contraseña' })
  @ApiOkResponse({ description: 'Usuario creado + JWT' })
  register(@Body() dto: RegisterDto, @ClientIp() ip: string) {
    this.limiter.consume(`register:ip:${ip}`, AUTH_LIMITS.registerPerIp);
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Entrar con correo o usuario + contraseña' })
  @ApiOkResponse({ description: 'JWT de acceso' })
  login(@Body() dto: LoginDto, @ClientIp() ip: string) {
    this.limiter.consume(`login:ip:${ip}`, AUTH_LIMITS.loginPerIp);
    const account = (dto.identifier ?? dto.login ?? dto.email ?? '')
      .trim()
      .toLowerCase();
    if (account) {
      this.limiter.consume(
        `login:account:${account}`,
        AUTH_LIMITS.loginPerAccount,
      );
    }
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Usuario actual (Bearer JWT)' })
  me(@Req() req: { user: User }) {
    return this.authService.toPublicUser(req.user);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar usuario / timezone / podiumHidden' })
  updateMe(@Req() req: { user: User }, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user, dto);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar la cuenta y todo su progreso' })
  deleteMe(@Req() req: { user: User }, @Body() dto: DeleteAccountDto) {
    return this.authService.deleteAccount(req.user, dto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar contraseña (sesión activa)' })
  changePassword(@Req() req: { user: User }, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user, dto);
  }
}
