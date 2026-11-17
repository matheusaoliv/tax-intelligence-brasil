import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuthenticatedRequest } from '../auth/session-auth.guard';
import { CreateMembershipDto } from './dto/create-membership.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrent(organizationId: string, role: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true, name: true, slug: true, createdAt: true },
    });
    if (!organization) throw new NotFoundException('Organização não encontrada.');
    return { ...organization, role };
  }

  listMembers(organizationId: string) {
    return this.prisma.membership.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'asc' },
      select: {
        role: true,
        createdAt: true,
        user: { select: { id: true, email: true, displayName: true } },
      },
    });
  }

  async addMember(input: CreateMembershipDto, actor: AuthenticatedRequest['user']) {
    if (actor.role === 'ADMIN' && input.role === 'ADMIN') {
      throw new ForbiddenException('Somente o proprietário pode conceder perfil de administrador.');
    }
    const email = input.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) throw new NotFoundException('Não existe uma conta cadastrada com este e-mail.');

    const existing = await this.prisma.membership.findUnique({
      where: { organizationId_userId: { organizationId: actor.organizationId, userId: user.id } },
      select: { id: true },
    });
    if (existing) throw new ConflictException('Este usuário já participa da organização.');

    const membership = await this.prisma.membership.create({
      data: { organizationId: actor.organizationId, userId: user.id, role: input.role },
      select: {
        role: true,
        createdAt: true,
        user: { select: { id: true, email: true, displayName: true } },
      },
    });
    await this.prisma.auditEvent.create({
      data: {
        organizationId: actor.organizationId,
        actorUserId: actor.userId,
        action: 'organization.member_added',
        resourceType: 'Membership',
        resourceId: user.id,
        metadata: { role: input.role },
      },
    });
    return membership;
  }
}
