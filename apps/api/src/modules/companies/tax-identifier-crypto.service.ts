import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createCipheriv, createHmac, randomBytes } from 'node:crypto';

@Injectable()
export class TaxIdentifierCryptoService {
  private getKey(): Buffer {
    const encoded = process.env.DATA_ENCRYPTION_KEY;
    if (!encoded) {
      throw new InternalServerErrorException('Criptografia de dados fiscais não configurada.');
    }
    const key = Buffer.from(encoded, 'base64');
    if (key.length !== 32) {
      throw new InternalServerErrorException('Chave de criptografia de dados fiscais inválida.');
    }
    return key;
  }

  encrypt(value: string): string {
    const key = this.getKey();
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return ['v1', iv.toString('base64url'), tag.toString('base64url'), encrypted.toString('base64url')].join('.');
  }

  fingerprint(value: string): string {
    return createHmac('sha256', this.getKey())
      .update('tax-identifier:v1:')
      .update(value)
      .digest('hex');
  }
}
