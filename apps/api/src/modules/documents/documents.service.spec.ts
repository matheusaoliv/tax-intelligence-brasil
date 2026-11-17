import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { DanfseGateway } from './danfse.gateway';
import { ObjectStorageService } from './object-storage.service';
import { DocumentsService } from './documents.service';

describe('DocumentsService tenant isolation', () => {
  const prisma = {
    document: { findMany: jest.fn(), findFirst: jest.fn() },
  };
  const storage = { createDownloadUrl: jest.fn() };
  const service = new DocumentsService(
    prisma as unknown as PrismaService,
    {} as DanfseGateway,
    storage as unknown as ObjectStorageService,
  );

  beforeEach(() => jest.clearAllMocks());

  it('scopes document history to the authenticated organization', async () => {
    prisma.document.findMany.mockResolvedValue([]);
    await service.list('organization-a');
    expect(prisma.document.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { organizationId: 'organization-a' } }),
    );
  });

  it('does not create download links for another organization documents', async () => {
    prisma.document.findFirst.mockResolvedValue(null);
    await expect(service.createDownloadUrl('document-from-b', 'organization-a'))
      .rejects.toThrow(NotFoundException);
    expect(prisma.document.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: 'document-from-b',
          organizationId: 'organization-a',
          status: 'SUCCEEDED',
          pdfObjectKey: { not: null },
        },
      }),
    );
    expect(storage.createDownloadUrl).not.toHaveBeenCalled();
  });
});
