import { BadGatewayException, Injectable } from '@nestjs/common';
import { FiscalEngine, Prisma } from '@prisma/client';

export interface EngineExecutionResult {
  output: Prisma.InputJsonValue;
  metadata: Prisma.InputJsonObject;
}

export class EngineGatewayError extends Error {
  constructor(readonly code: string) {
    super(code);
    this.name = 'EngineGatewayError';
  }
}

@Injectable()
export class FiscalEngineGateway {
  async execute(engine: FiscalEngine, payload: Record<string, unknown>): Promise<EngineExecutionResult> {
    const config = this.getConfig(engine);
    const baseUrl = config.baseUrl.replace(/\/+$/, '');
    let response: Response;

    try {
      response = await fetch(`${baseUrl}${config.path}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20_000),
      });
    } catch {
      throw new EngineGatewayError('ENGINE_UNAVAILABLE');
    }

    if (!response.ok) {
      throw new EngineGatewayError('ENGINE_REJECTED_REQUEST');
    }

    const responseText = await response.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(responseText) as unknown;
    } catch {
      throw new EngineGatewayError('ENGINE_INVALID_RESPONSE');
    }
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new EngineGatewayError('ENGINE_INVALID_RESPONSE');
    }
    const output = parsed as Prisma.InputJsonObject;

    return {
      output,
      metadata: {
        httpStatus: response.status,
        warningDadosSimulados: response.headers.get('x-warning-dados-simulados'),
        endpointPath: config.path,
      },
    };
  }

  private getConfig(engine: FiscalEngine): { baseUrl: string; path: string } {
    if (engine === FiscalEngine.RTC_REGIME_REGULAR) {
      return {
        baseUrl: process.env.REGIME_REGULAR_ENGINE_URL ?? 'http://127.0.0.1:8080',
        path: '/api/calculadora/observabilidade/regime-geral',
      };
    }
    if (engine === FiscalEngine.RTC_SIMPLES_NACIONAL) {
      return {
        baseUrl: process.env.SIMPLES_NACIONAL_ENGINE_URL ?? 'http://127.0.0.1:8082',
        path: '/api/calculadora/observabilidade/simples-nacional',
      };
    }
    throw new BadGatewayException('Este motor não está disponível neste fluxo.');
  }
}
