import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';
import { AuthenticatedRequest, SessionAuthGuard } from './session-auth.guard';

const COOKIE_NAME = 'tib_session';
const SESSION_MAX_AGE = 8 * 60 * 60 * 1000;

function sessionCookieOptions() {
  const sameSite = process.env.SESSION_COOKIE_SAME_SITE === 'none' ? 'none' as const : 'lax' as const;
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || sameSite === 'none',
    sameSite,
    path: '/api/v1',
  };
}

function setSessionCookie(response: Response, token: string): void {
  response.cookie(COOKIE_NAME, token, { ...sessionCookieOptions(), maxAge: SESSION_MAX_AGE });
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async register(@Body() input: RegisterDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.register(input);
    setSessionCookie(response, result.accessToken);
    const { accessToken: _token, ...safeResult } = result;
    return safeResult;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async login(@Body() input: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(input);
    setSessionCookie(response, result.accessToken);
    const { accessToken: _token, ...safeResult } = result;
    return safeResult;
  }

  @Get('me')
  @UseGuards(SessionAuthGuard)
  getCurrentUser(@Req() request: AuthenticatedRequest) {
    return { userId: request.user.userId, organizationId: request.user.organizationId, role: request.user.role };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(SessionAuthGuard)
  async logout(
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.revokeSession(request.user.sessionId);
    response.clearCookie(COOKIE_NAME, sessionCookieOptions());
  }
}
