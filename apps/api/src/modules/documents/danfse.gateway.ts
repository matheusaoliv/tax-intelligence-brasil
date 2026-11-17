import { Injectable } from '@nestjs/common';

export class DanfseGatewayError extends Error {
  constructor(readonly code: string) {
    super(code);
    this.name = 'DanfseGatewayError';
  }
}

@Injectable()
export class DanfseGateway {
  async generate(xml: string, stc: '0' | '1' | '2', canhoto: boolean): Promise<Buffer> {
    const baseUrl = (process.env.DANFSE_ENGINE_URL ?? 'http://127.0.0.1:8083').replace(/\/+$/, '');
    const query = new URLSearchParams({ stc, canhoto: String(canhoto) });
    let response: Response;

    try {
      response = await fetch(`${baseUrl}/api/danfse?${query.toString()}`, {
        method: 'POST',
        headers: { 'content-type': 'application/xml', accept: 'application/pdf' },
        body: xml,
        signal: AbortSignal.timeout(30_000),
      });
    } catch {
      throw new DanfseGatewayError('DANFSE_ENGINE_UNAVAILABLE');
    }

    if (!response.ok) throw new DanfseGatewayError('DANFSE_ENGINE_REJECTED_REQUEST');
    if (!response.headers.get('content-type')?.toLowerCase().includes('application/pdf')) {
      throw new DanfseGatewayError('DANFSE_ENGINE_INVALID_CONTENT_TYPE');
    }

    const pdf = Buffer.from(await response.arrayBuffer());
    if (pdf.length < 5 || pdf.subarray(0, 5).toString('ascii') !== '%PDF-') {
      throw new DanfseGatewayError('DANFSE_ENGINE_INVALID_PDF');
    }
    return pdf;
  }
}
