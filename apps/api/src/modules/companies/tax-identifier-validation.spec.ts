import { UnprocessableEntityException } from '@nestjs/common';
import { normalizeAndValidateTaxIdentifier } from './tax-identifier-validation';

describe('normalizeAndValidateTaxIdentifier', () => {
  it('normalizes and validates a CPF', () => {
    expect(normalizeAndValidateTaxIdentifier('529.982.247-25')).toBe('52998224725');
  });

  it('normalizes and validates a numeric CNPJ', () => {
    expect(normalizeAndValidateTaxIdentifier('11.222.333/0001-81')).toBe('11222333000181');
  });

  it('accepts the official alphanumeric CNPJ calculation example', () => {
    expect(normalizeAndValidateTaxIdentifier('12.ABC.345/01DE-35')).toBe('12ABC34501DE35');
  });

  it('accepts the first alphanumeric CNPJ announced by Receita Federal', () => {
    expect(normalizeAndValidateTaxIdentifier('00.000.000/E08G-12')).toBe('00000000E08G12');
  });

  it('rejects invalid check digits', () => {
    expect(() => normalizeAndValidateTaxIdentifier('529.982.247-24'))
      .toThrow(UnprocessableEntityException);
  });

  it('rejects repeated sequences', () => {
    expect(() => normalizeAndValidateTaxIdentifier('000.000.000-00'))
      .toThrow(UnprocessableEntityException);
  });
});
