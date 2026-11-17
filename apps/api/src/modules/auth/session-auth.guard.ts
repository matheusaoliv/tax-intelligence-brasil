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

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de acesso obrigatório.');
    }

    const token = authorization.slice('Bearer '.length).trim();
    if (token.length < 32 || token.length > 256) {
      throw new UnauthorizedException('Token de acesso inválido.');
    }

    request.user = await this.authService.authenticate(token);
    return true;
  }
}
