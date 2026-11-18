import { BadGatewayException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { FiscalEngine, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../database/prisma.service';
import { AuthenticatedRequest } from '../auth/session-auth.guard';
import { CreateCalculationDto } from './dto/create-calculation.dto';
import { EngineGatewayError, FiscalEngineGateway } from './fiscal-engine.gateway';

const ENGINE_INFO = {
  [FiscalEngine.RTC_REGIME_REGULAR]: {
    version: '1.6.1',
    commitSha: '150cccbe414d4a5edea703e4f7a424af5aa222c7',
    repository: 'https://github.com/ReceitaFederal/calculadora-rtc-regime-regular',
  },
  [FiscalEngine.RTC_SIMPLES_NACIONAL]: {
    version: '0.0.6',
    commitSha: 'c5b0f01c8351c3f0d0795cc617b29d233e9f98df',
    repository: 'https://github.com/ReceitaFederal/calculadora-rtc-simples-nacional',
  },
};

@Injectable()
export class CalculationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: FiscalEngineGateway,
  ) {}

  async create(input: CreateCalculationDto, actor: AuthenticatedRequest['user']) {
    if (input.companyId) {
      const company = await this.prisma.company.findFirst({
        where: { id: input.companyId, organizationId: actor.organizationId },
        select: { id: true },
      });
      if (!company) throw new UnprocessableEntityException('Empresa não encontrada nesta organização.');
    }

    const engineInfo = ENGINE_INFO[input.engine];
    const correlationId = randomUUID();
    const calculation = await this.prisma.fiscalCalculation.create({
      data: {
        organizationId: actor.organizationId,
        companyId: input.companyId ?? null,
        engine: input.engine,
        engineVersion: engineInfo.version,
        engineCommitSha: engineInfo.commitSha,
        engineRepository: engineInfo.repository,
        inputPayload: input.inputPayload as Prisma.InputJsonObject,
        correlationId,
      },
      select: { id: true, organizationId: true, engine: true, status: true, createdAt: true },
    });

    await this.prisma.auditEvent.create({
      data: {
        organizationId: actor.organizationId,
        actorUserId: actor.userId,
        action: 'calculation.received',
        resourceType: 'FiscalCalculation',
        resourceId: calculation.id,
        correlationId,
        metadata: { engine: input.engine },
      },
    });

    await this.prisma.fiscalCalculation.update({
      where: { id: calculation.id },
      data: { status: 'PROCESSING' },
    });

    try {
      const execution = await this.gateway.execute(input.engine, input.inputPayload);
      const completed = await this.prisma.fiscalCalculation.update({
        where: { id: calculation.id },
        data: {
          status: 'SUCCEEDED',
          originalOutput: execution.output,
          responseMetadata: execution.metadata,
          completedAt: new Date(),
        },
        select: {
          id: true, engine: true, status: true, engineVersion: true, engineCommitSha: true,
          engineRepository: true, originalOutput: true, responseMetadata: true,
          correlationId: true, createdAt: true, completedAt: true,
        },
      });
      await this.prisma.auditEvent.create({
        data: {
          organizationId: actor.organizationId,
          actorUserId: actor.userId,
          action: 'calculation.succeeded',
          resourceType: 'FiscalCalculation',
          resourceId: calculation.id,
          correlationId,
          metadata: { engine: input.engine, engineCommitSha: engineInfo.commitSha },
        },
      });
      return completed;
    } catch (error) {
      const errorCode = error instanceof EngineGatewayError ? error.code : 'ENGINE_EXECUTION_FAILED';
      await this.prisma.fiscalCalculation.update({
        where: { id: calculation.id },
        data: {
          status: 'FAILED',
          errorCode,
          completedAt: new Date(),
          ...(error instanceof EngineGatewayError && error.details ? { originalOutput: error.details } : {}),
          ...(error instanceof EngineGatewayError && error.httpStatus ? { responseMetadata: { httpStatus: error.httpStatus } } : {}),
        },
      });
      await this.prisma.auditEvent.create({
        data: {
          organizationId: actor.organizationId,
          actorUserId: actor.userId,
          action: 'calculation.failed',
          resourceType: 'FiscalCalculation',
          resourceId: calculation.id,
          correlationId,
          metadata: { engine: input.engine, errorCode },
        },
      });
      throw new BadGatewayException({
        message: 'Não foi possível concluir o cálculo no motor fiscal. Tente novamente mais tarde.',
        correlationId,
        errorCode,
      });
    }
  }

  list(organizationId: string) {
    return this.prisma.fiscalCalculation.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true, engine: true, status: true, engineVersion: true,
        engineCommitSha: true, correlationId: true, createdAt: true, completedAt: true,
      },
    });
  }

  async getById(id: string, organizationId: string) {
    const calculation = await this.prisma.fiscalCalculation.findFirst({
      where: { id, organizationId },
      select: {
        id: true, engine: true, status: true, engineVersion: true, engineCommitSha: true,
        engineRepository: true, inputPayload: true, originalOutput: true, responseMetadata: true,
        errorCode: true, correlationId: true, createdAt: true, completedAt: true,
      },
    });
    if (!calculation) throw new NotFoundException('Cálculo não encontrado.');
    return calculation;
  }
}
