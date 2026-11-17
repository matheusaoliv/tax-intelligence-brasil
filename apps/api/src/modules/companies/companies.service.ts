import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuthenticatedRequest } from '../auth/session-auth.guard';
import { CreateCompanyDto } from './dto/create-company.dto';
import { TaxIdentifierCryptoService } from './tax-identifier-crypto.service';
import { normalizeAndValidateTaxIdentifier } from './tax-identifier-validation';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: TaxIdentifierCryptoService,
  ) {}

  async create(input: CreateCompanyDto, actor: AuthenticatedRequest['user']) {
    const taxIdentifier = normalizeAndValidateTaxIdentifier(input.taxIdentifier);
    const taxIdentifierHash = this.crypto.fingerprint(taxIdentifier);
    const existing = await this.prisma.company.findFirst({
      where: { organizationId: actor.organizationId, taxIdentifierHash },
      select: { id: true },
    });
    if (existing) throw new ConflictException('Esta empresa já está cadastrada nesta organização.');

    const company = await this.prisma.company.create({
      data: {
        organizationId: actor.organizationId,
        legalName: input.legalName.trim(),
        taxIdentifierEncrypted: this.crypto.encrypt(taxIdentifier),
        taxIdentifierHash,
        taxIdentifierSuffix: taxIdentifier.slice(-4),
      },
      select: { id: true, legalName: true, taxIdentifierSuffix: true, createdAt: true },
    });
    await this.prisma.auditEvent.create({
      data: {
        organizationId: actor.organizationId,
        actorUserId: actor.userId,
        action: 'company.created',
        resourceType: 'Company',
        resourceId: company.id,
        metadata: { identifierType: taxIdentifier.length === 11 ? 'CPF' : 'CNPJ' },
      },
    });

    return {
      id: company.id,
      legalName: company.legalName,
      taxIdentifierMasked: `••••••••${company.taxIdentifierSuffix}`,
      createdAt: company.createdAt,
    };
  }

  async list(organizationId: string) {
    const companies = await this.prisma.company.findMany({
      where: { organizationId },
      orderBy: { legalName: 'asc' },
      select: { id: true, legalName: true, taxIdentifierSuffix: true, createdAt: true },
    });
    return companies.map((company) => ({
      id: company.id,
      legalName: company.legalName,
      taxIdentifierMasked: `••••••••${company.taxIdentifierSuffix}`,
      createdAt: company.createdAt,
    }));
  }

  async getById(id: string, organizationId: string) {
    const company = await this.prisma.company.findFirst({
      where: { id, organizationId },
      select: { id: true, legalName: true, taxIdentifierSuffix: true, createdAt: true },
    });
    if (!company) throw new NotFoundException('Empresa não encontrada.');
    return {
      id: company.id,
      legalName: company.legalName,
      taxIdentifierMasked: `••••••••${company.taxIdentifierSuffix}`,
      createdAt: company.createdAt,
    };
  }
}
