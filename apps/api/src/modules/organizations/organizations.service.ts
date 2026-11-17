import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

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
}
