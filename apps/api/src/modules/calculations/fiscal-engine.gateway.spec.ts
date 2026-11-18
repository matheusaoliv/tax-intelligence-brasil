import { FiscalEngine } from '@prisma/client';
import { EngineGatewayError, FiscalEngineGateway } from './fiscal-engine.gateway';

describe('FiscalEngineGateway', () => {
  const regularPayload = {
  id: '6194602ea71cbf9431c236de4409d920',
  versao: '1.0.0',
  dhFatoGerador: '2027-03-10T10:00:00-03:00',
  municipio: 4314902,
  uf: 'RS',
  itens: [{ numero: 1, cst: '200', cClassTrib: '200003', ncm: '10063021', baseCalculo: 100 }],
};
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

    const result = await gateway.execute(FiscalEngine.RTC_REGIME_REGULAR, regularPayload);

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

    await gateway.execute(FiscalEngine.RTC_SIMPLES_NACIONAL, {
      id: 'calc-001', versao: '2.0.0', data: '2027-03-15', tpDoc: '55', CRT: '1',
      itens: [{ cClassTrib: '000001', baseCalculo: '950.00', valorImpostoSeletivo: '0.00' }],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://simples-engine:8082/api/calculadora/observabilidade/simples-nacional',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('preserves structured upstream validation errors for the tenant history', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(new Response(JSON.stringify({ code: 'RTC-001', detail: 'Invalid item' }), {
      status: 422,
      headers: { 'content-type': 'application/problem+json' },
    }));

    await expect(gateway.execute(FiscalEngine.RTC_REGIME_REGULAR, regularPayload))
      .rejects.toMatchObject({
        code: 'ENGINE_REJECTED_REQUEST',
        httpStatus: 422,
        details: { code: 'RTC-001', detail: 'Invalid item' },
      });
  });

  it('rejects non-JSON upstream responses', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(new Response('not-json', { status: 200 }));

    await expect(gateway.execute(FiscalEngine.RTC_REGIME_REGULAR, regularPayload))
      .rejects.toMatchObject({ code: 'ENGINE_INVALID_RESPONSE' });
  });
});
