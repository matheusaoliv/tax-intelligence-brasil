import { ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  const prisma = { $queryRaw: jest.fn() };
  const controller = new HealthController(prisma as unknown as PrismaService);

  beforeEach(() => jest.clearAllMocks());

  it('returns API liveness with an ISO timestamp', () => {
    const result = controller.getHealth();
    expect(result.status).toBe('ok');
    expect(result.service).toBe('tax-intelligence-api');
    expect(Number.isNaN(Date.parse(result.timestamp))).toBe(false);
  });

  it('reports readiness only when PostgreSQL is reachable', async () => {
    prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);
    const result = await controller.getReadiness();
    expect(result.status).toBe('ready');
    expect(result.dependencies.database).toBe('ok');
  });

  it('returns service unavailable when PostgreSQL cannot be reached', async () => {
    prisma.$queryRaw.mockRejectedValue(new Error('private database detail'));
    await expect(controller.getReadiness()).rejects.toThrow(ServiceUnavailableException);
  });
});
