import { TaxIdentifierCryptoService } from './tax-identifier-crypto.service';

describe('TaxIdentifierCryptoService', () => {
  const service = new TaxIdentifierCryptoService();
  const previousKey = process.env.DATA_ENCRYPTION_KEY;

  beforeEach(() => {
    process.env.DATA_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString('base64');
  });

  afterAll(() => {
    if (previousKey === undefined) delete process.env.DATA_ENCRYPTION_KEY;
    else process.env.DATA_ENCRYPTION_KEY = previousKey;
  });

  it('encrypts identifiers without storing the plaintext in the encoded value', () => {
    const identifier = '12345678901';
    const encrypted = service.encrypt(identifier);

    expect(encrypted).not.toContain(identifier);
    expect(encrypted.split('.')).toHaveLength(4);
    expect(encrypted.startsWith('v1.')).toBe(true);
  });

  it('creates a stable keyed fingerprint for duplicate detection', () => {
    expect(service.fingerprint('12345678901')).toBe(service.fingerprint('12345678901'));
    expect(service.fingerprint('12345678901')).not.toBe(service.fingerprint('10987654321'));
  });

  it('rejects missing encryption keys', () => {
    delete process.env.DATA_ENCRYPTION_KEY;
    expect(() => service.encrypt('12345678901')).toThrow();
  });
});
