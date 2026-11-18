import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';

export interface AuthenticatedRequest extends Request {
  user: {
    sessionId: string;
    userId: string;
    organizationId: string;
    role: string;
  };
}

function readCookie(cookieHeader: string | undefined, name: string): string | undefined {
  const entry = cookieHeader?.split(';').map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  if (!entry) return undefined;
  try {
    return decodeURIComponent(entry.slice(name.length + 1));
  } catch {
    return undefined;
  }
}

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const cookieToken = readCookie(request.headers.cookie, 'tib_session');
    const token = cookieToken;

    if (cookieToken && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      const allowedOrigins = (process.env.WEB_ORIGIN ?? 'http://localhost:3000')
        .split(',').map((origin) => origin.trim());
      if (!request.headers.origin || !allowedOrigins.includes(request.headers.origin)) {
        throw new ForbiddenException('Origem da requisição não autorizada.');
      }
    }

    if (!token || token.length < 32 || token.length > 256) {
      throw new UnauthorizedException('Sessão de acesso obrigatória ou inválida.');
    }

    request.user = await this.authService.authenticate(token);
    return true;
  }
}
