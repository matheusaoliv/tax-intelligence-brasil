import { BadGatewayException, NotFoundException } from '@nestjs/common';
import { ReferenceDataGateway } from './reference-data.gateway';

describe('ReferenceDataGateway', () => {
  const gateway = new ReferenceDataGateway();
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    delete process.env.REGIME_REGULAR_ENGINE_URL;
  });

  it('forwards only to the configured official reference-data endpoint', async () => {
    const fetchMock = jest.fn().mockResolvedValue(new Response(JSON.stringify({ itens: [] }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }));
    globalThis.fetch = fetchMock;
    process.env.REGIME_REGULAR_ENGINE_URL = 'http://regime-engine:8080/';

    const result = await gateway.getRegimeRegular('ncm', { ncm: '22030000', data: '2027-01-01' });

    const calledUrl = fetchMock.mock.calls[0][0] as URL;
    expect(calledUrl.toString()).toBe('http://regime-engine:8080/api/calculadora/dados-abertos/ncm?ncm=22030000&data=2027-01-01');
    expect(result).toEqual({ itens: [] });
  });

  it('preserves an upstream 404 as a not-found result', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(new Response('', { status: 404 }));
    await expect(gateway.getRegimeRegular('ncm', { ncm: '00000000', data: '2027-01-01' }))
      .rejects.toThrow(NotFoundException);
  });

  it('returns a safe gateway error when the upstream service is unavailable', async () => {
    globalThis.fetch = jest.fn().mockRejectedValue(new Error('private internal host'));
    await expect(gateway.getRegimeRegular('ncm', { ncm: '00000000', data: '2027-01-01' }))
      .rejects.toThrow(BadGatewayException);
  });
});
