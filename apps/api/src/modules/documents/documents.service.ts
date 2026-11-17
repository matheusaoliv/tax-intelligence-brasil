import { BadGatewayException, Injectable, NotFoundException, PayloadTooLargeException, UnprocessableEntityException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../database/prisma.service';
import { AuthenticatedRequest } from '../auth/session-auth.guard';
import { CreateDanfseDto } from './dto/create-danfse.dto';
import { DanfseGateway, DanfseGatewayError } from './danfse.gateway';
import { ObjectStorageService } from './object-storage.service';

const DANFSE_VERSION = '1.0.0';
const DANFSE_COMMIT = '8d79e6b2f7fad6375340afcb51c85ed370c64a14';
const DANFSE_REPOSITORY = 'https://github.com/ReceitaFederal/calculadora-rtc-gerador-danfse';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: DanfseGateway,
    private readonly storage: ObjectStorageService,
  ) {}

  async createDanfse(input: CreateDanfseDto, actor: AuthenticatedRequest['user']) {
    const maxBytes = Number(process.env.XML_MAX_SIZE_BYTES ?? 5_242_880);
    if (!Number.isInteger(maxBytes) || maxBytes < 1 || maxBytes > 33_554_432) {
      throw new UnprocessableEntityException('Limite de XML configurado incorretamente.');
    }
    const xmlBytes = Buffer.byteLength(input.xml, 'utf8');
    if (xmlBytes > maxBytes) throw new PayloadTooLargeException('O XML ultrapassa o limite permitido.');
    if (/<!DOCTYPE|<!ENTITY/i.test(input.xml)) {
      throw new UnprocessableEntityException('Declarações DTD e entidades XML não são permitidas.');
    }

    if (input.companyId) {
      const company = await this.prisma.company.findFirst({
        where: { id: input.companyId, organizationId: actor.organizationId },
        select: { id: true },
      });
      if (!company) throw new UnprocessableEntityException('Empresa não encontrada nesta organização.');
    }

    const id = randomUUID();
    const correlationId = randomUUID();
    const sourceXmlObjectKey = `${actor.organizationId}/documents/${id}/source.xml`;
    const pdfObjectKey = `${actor.organizationId}/documents/${id}/danfse.pdf`;

    await this.prisma.document.create({
      data: {
        id,
        organizationId: actor.organizationId,
        companyId: input.companyId ?? null,
        type: 'DANFSE',
        status: 'RECEIVED',
        sourceXmlObjectKey,
        engineVersion: DANFSE_VERSION,
        engineCommitSha: DANFSE_COMMIT,
        engineRepository: DANFSE_REPOSITORY,
        correlationId,
      },
    });
    await this.prisma.auditEvent.create({
      data: {
        organizationId: actor.organizationId,
        actorUserId: actor.userId,
        action: 'document.received',
        resourceType: 'Document',
        resourceId: id,
        correlationId,
        metadata: { type: 'DANFSE', xmlBytes },
      },
    });

    try {
      await this.storage.upload(sourceXmlObjectKey, Buffer.from(input.xml, 'utf8'), 'application/xml');
      await this.prisma.document.update({ where: { id }, data: { status: 'PROCESSING' } });
      const pdf = await this.gateway.generate(input.xml, input.stc ?? '0', input.canhoto ?? true);
      await this.storage.upload(pdfObjectKey, pdf, 'application/pdf');
    } catch (error) {
      const errorCode = error instanceof DanfseGatewayError ? error.code : 'DOCUMENT_PROCESSING_FAILED';
      await this.prisma.document.update({
        where: { id },
        data: { status: 'FAILED', errorCode, completedAt: new Date() },
      });
      await this.prisma.auditEvent.create({
        data: {
          organizationId: actor.organizationId,
          actorUserId: actor.userId,
          action: 'document.failed',
          resourceType: 'Document',
          resourceId: id,
          correlationId,
          metadata: { type: 'DANFSE', errorCode },
        },
      });
      throw new BadGatewayException({
        message: 'Não foi possível gerar o DANFSe. Verifique o XML ou tente novamente.',
        correlationId,
        errorCode,
      });
    }

    const completed = await this.prisma.document.update({
      where: { id },
      data: { status: 'SUCCEEDED', pdfObjectKey, completedAt: new Date() },
      select: {
        id: true, type: true, status: true, engineVersion: true, engineCommitSha: true,
        correlationId: true, createdAt: true, completedAt: true,
      },
    });
    await this.prisma.auditEvent.create({
      data: {
        organizationId: actor.organizationId,
        actorUserId: actor.userId,
        action: 'document.generated',
        resourceType: 'Document',
        resourceId: id,
        correlationId,
        metadata: { type: 'DANFSE', engineCommitSha: DANFSE_COMMIT },
      },
    });
    return completed;
  }

  list(organizationId: string) {
    return this.prisma.document.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true, type: true, status: true, engineVersion: true,
        engineCommitSha: true, correlationId: true, createdAt: true, completedAt: true,
      },
    });
  }

  async createDownloadUrl(id: string, organizationId: string): Promise<{ url: string; expiresInSeconds: number }> {
    const document = await this.prisma.document.findFirst({
      where: { id, organizationId, status: 'SUCCEEDED', pdfObjectKey: { not: null } },
      select: { pdfObjectKey: true },
    });
    if (!document?.pdfObjectKey) throw new NotFoundException('Documento não encontrado ou ainda não está disponível.');
    return { url: await this.storage.createDownloadUrl(document.pdfObjectKey), expiresInSeconds: 300 };
  }
}
