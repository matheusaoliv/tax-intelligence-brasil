import { FiscalEngine } from '@prisma/client';
import { EngineGatewayError, FiscalEngineGateway } from './fiscal-engine.gateway';

describe('FiscalEngineGateway', () => {
  const gateway = new FiscalEngineGateway();
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    delete process.env.REGIME_REGULAR_ENGINE_URL;
    delete process.env.SIMPLES_NACIONAL_ENGINE_URL;
  });

  it('calls the official Regime Regular observability endpoint and preserves warning metadata', async () => {
    const fetchMock = jest.fn().mockResolvedValue(new Response(JSON.stringify({ resultado: 'fixture' }), {
      status: 200,
      headers: { 'content-type': 'application/json', 'x-warning-dados-simulados': '1' },
    }));
    globalThis.fetch = fetchMock;

    const result = await gateway.execute(FiscalEngine.RTC_REGIME_REGULAR, { id: 'fixture-1' });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:8080/api/calculadora/observabilidade/regime-geral',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(result.output).toEqual({ resultado: 'fixture' });
    expect(result.metadata.warningDadosSimulados).toBe('1');
  });

  it('calls the official Simples Nacional endpoint', async () => {
    process.env.SIMPLES_NACIONAL_ENGINE_URL = 'http://simples-engine:8082/';
    const fetchMock = jest.fn().mockResolvedValue(new Response(JSON.stringify({ itens: [] }), { status: 200 }));
    globalThis.fetch = fetchMock;

    await gateway.execute(FiscalEngine.RTC_SIMPLES_NACIONAL, { id: 'fixture-2' });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://simples-engine:8082/api/calculadora/observabilidade/simples-nacional',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('does not expose an upstream response body when the engine rejects a request', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(new Response('sensitive upstream details', { status: 422 }));

    await expect(gateway.execute(FiscalEngine.RTC_REGIME_REGULAR, {}))
      .rejects.toBeInstanceOf(EngineGatewayError);
  });

  it('rejects non-JSON upstream responses', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(new Response('not-json', { status: 200 }));

    await expect(gateway.execute(FiscalEngine.RTC_REGIME_REGULAR, {}))
      .rejects.toMatchObject({ code: 'ENGINE_INVALID_RESPONSE' });
  });
});
