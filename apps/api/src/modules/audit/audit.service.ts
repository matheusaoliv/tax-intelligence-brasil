import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  list(organizationId: string, limit: number) {
    return this.prisma.auditEvent.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        actorUserId: true,
        action: true,
        resourceType: true,
        resourceId: true,
        metadata: true,
        correlationId: true,
        createdAt: true,
      },
    });
  }
}
