import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getHealth() {
    return {
      status: 'ok' as const,
      service: 'tax-intelligence-api' as const,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('live')
  getLiveness() {
    return this.getHealth();
  }

  @Get('ready')
  async getReadiness() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ready' as const,
        service: 'tax-intelligence-api' as const,
        dependencies: { database: 'ok' as const },
        timestamp: new Date().toISOString(),
      };
    } catch {
      throw new ServiceUnavailableException({
        status: 'not_ready',
        service: 'tax-intelligence-api',
        dependencies: { database: 'unavailable' },
      });
    }
  }
}
