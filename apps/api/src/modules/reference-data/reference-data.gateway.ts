import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ReferenceDataGateway {
  async getRegimeRegular(path: string, query: Record<string, string>): Promise<unknown> {
    return this.get(
      process.env.REGIME_REGULAR_ENGINE_URL ?? 'http://127.0.0.1:8080',
      '/api/calculadora/dados-abertos/' + path,
      query,
    );
  }

  async getSimplesNacional(path: string, query: Record<string, string>): Promise<unknown> {
    return this.get(
      process.env.SIMPLES_NACIONAL_ENGINE_URL ?? 'http://127.0.0.1:8082',
      '/api/calculadora/simples-nacional/' + path,
      query,
    );
  }

  private async get(baseUrl: string, path: string, query: Record<string, string>): Promise<unknown> {
    const url = new URL(path, baseUrl.replace(/\/+$/, '') + '/');
    for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);

    let response: Response;
    try {
      response = await fetch(url, { method: 'GET', headers: { accept: 'application/json' }, signal: AbortSignal.timeout(10_000) });
    } catch {
      throw new BadGatewayException('Serviço de dados fiscais indisponível.');
    }
    if (!response.ok) {
      if (response.status === 404) throw new NotFoundException('Consulta não encontrada ou fora da vigência no motor oficial.');
      throw new BadGatewayException('Não foi possível consultar os dados fiscais oficiais.');
    }
    return response.json();
  }
}
