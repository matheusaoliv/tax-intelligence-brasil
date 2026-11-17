import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { FiscalEngineGateway } from './fiscal-engine.gateway';
import { CalculationsService } from './calculations.service';

describe('CalculationsService tenant isolation', () => {
  const prisma = {
    fiscalCalculation: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };
  const service = new CalculationsService(
    prisma as unknown as PrismaService,
    {} as FiscalEngineGateway,
  );

  beforeEach(() => jest.clearAllMocks());

  it('always scopes calculation lists to the authenticated organization', async () => {
    prisma.fiscalCalculation.findMany.mockResolvedValue([]);
    await service.list('organization-a');
    expect(prisma.fiscalCalculation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { organizationId: 'organization-a' } }),
    );
  });

  it('does not reveal a calculation belonging to another organization', async () => {
    prisma.fiscalCalculation.findFirst.mockResolvedValue(null);
    await expect(service.getById('calculation-from-b', 'organization-a'))
      .rejects.toThrow(NotFoundException);
    expect(prisma.fiscalCalculation.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'calculation-from-b', organizationId: 'organization-a' } }),
    );
  });
});
