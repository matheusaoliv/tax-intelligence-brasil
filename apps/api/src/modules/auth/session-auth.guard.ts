import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
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
  return decodeURIComponent(entry.slice(name.length + 1));
}

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;
    const bearerToken = authorization?.startsWith('Bearer ')
      ? authorization.slice('Bearer '.length).trim()
      : undefined;
    const token = bearerToken ?? readCookie(request.headers.cookie, 'tib_session');

    if (!token || token.length < 32 || token.length > 256) {
      throw new UnauthorizedException('Sessão de acesso obrigatória ou inválida.');
    }

    request.user = await this.authService.authenticate(token);
    return true;
  }
}
