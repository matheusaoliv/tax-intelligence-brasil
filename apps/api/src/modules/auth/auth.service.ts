import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes, createHash } from 'node:crypto';
import * as argon2 from 'argon2';
import { PrismaService } from '../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function createSlug(name: string): string {
  const base = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
  return base || 'organizacao';
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(input: RegisterDto) {
    const email = input.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) throw new ConflictException('Já existe uma conta com este e-mail.');

    const passwordHash = await argon2.hash(input.password, { type: argon2.argon2id });
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    const organizationSlug = `${createSlug(input.organizationName)}-${randomBytes(3).toString('hex')}`;

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, displayName: input.displayName.trim(), passwordHash },
        select: { id: true, email: true, displayName: true },
      });
      const organization = await tx.organization.create({
        data: { name: input.organizationName.trim(), slug: organizationSlug },
        select: { id: true, name: true, slug: true },
      });
      await tx.membership.create({
        data: { userId: user.id, organizationId: organization.id, role: 'OWNER' },
      });
      await tx.session.create({
        data: { userId: user.id, organizationId: organization.id, tokenHash: hashToken(token), expiresAt },
      });
      return { user, organization };
    });

    return {
      accessToken: token,
      tokenType: 'Bearer' as const,
      expiresAt: expiresAt.toISOString(),
      user: result.user,
      organization: result.organization,
      role: 'OWNER' as const,
    };
  }

  async login(input: LoginDto) {
    const email = input.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { memberships: { include: { organization: { select: { id: true, name: true, slug: true } } } } },
    });
    if (!user || !(await argon2.verify(user.passwordHash, input.password))) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    if (user.memberships.length === 0) {
      throw new UnauthorizedException('Esta conta não possui organização ativa.');
    }

    const membership = input.organizationId
      ? user.memberships.find((item) => item.organizationId === input.organizationId)
      : user.memberships.length === 1 ? user.memberships[0] : undefined;

    if (!membership) {
      if (!input.organizationId && user.memberships.length > 1) {
        throw new ConflictException({
          message: 'Selecione a organização para entrar.',
          organizations: user.memberships.map(({ organization, role }) => ({ ...organization, role })),
        });
      }
      throw new UnauthorizedException('Acesso não autorizado para esta organização.');
    }

    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    await this.prisma.session.create({
      data: {
        userId: user.id,
        organizationId: membership.organizationId,
        tokenHash: hashToken(token),
        expiresAt,
      },
    });

    return {
      accessToken: token,
      tokenType: 'Bearer' as const,
      expiresAt: expiresAt.toISOString(),
      user: { id: user.id, email: user.email, displayName: user.displayName },
      organization: membership.organization,
      role: membership.role,
    };
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { id: sessionId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async authenticate(token: string) {
    const session = await this.prisma.session.findFirst({
      where: { tokenHash: hashToken(token), revokedAt: null, expiresAt: { gt: new Date() } },
      select: { id: true, userId: true, organizationId: true },
    });
    if (!session) throw new UnauthorizedException('Sessão inválida ou expirada.');

    const membership = await this.prisma.membership.findUnique({
      where: { organizationId_userId: { organizationId: session.organizationId, userId: session.userId } },
      select: { role: true },
    });
    if (!membership) throw new UnauthorizedException('Acesso à organização revogado.');

    await this.prisma.session.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() },
    });

    return { sessionId: session.id, userId: session.userId, organizationId: session.organizationId, role: membership.role };
  }
}
