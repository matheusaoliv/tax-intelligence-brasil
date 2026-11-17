import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TaxIdentifierCryptoService } from './tax-identifier-crypto.service';
import { CompaniesService } from './companies.service';

describe('CompaniesService tenant isolation', () => {
  const prisma = {
    company: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };
  const service = new CompaniesService(
    prisma as unknown as PrismaService,
    {} as TaxIdentifierCryptoService,
  );

  beforeEach(() => jest.clearAllMocks());

  it('scopes company lists to the authenticated organization', async () => {
    prisma.company.findMany.mockResolvedValue([]);
    await service.list('organization-a');
    expect(prisma.company.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { organizationId: 'organization-a' } }),
    );
  });

  it('does not reveal a company belonging to another organization', async () => {
    prisma.company.findFirst.mockResolvedValue(null);
    await expect(service.getById('company-from-b', 'organization-a'))
      .rejects.toThrow(NotFoundException);
    expect(prisma.company.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'company-from-b', organizationId: 'organization-a' } }),
    );
  });
});
