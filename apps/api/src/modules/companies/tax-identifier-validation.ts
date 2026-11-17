import { UnprocessableEntityException } from '@nestjs/common';

function digitFromMod11(sum: number): number {
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

function validateCpf(value: string): boolean {
  if (!/^\d{11}$/.test(value) || /^([0-9])\1{10}$/.test(value)) return false;
  const digits = value.split('').map(Number);
  const first = digitFromMod11(digits.slice(0, 9).reduce((sum, digit, index) => sum + digit * (10 - index), 0));
  const second = digitFromMod11(digits.slice(0, 9).concat(first).reduce((sum, digit, index) => sum + digit * (11 - index), 0));
  return digits[9] === first && digits[10] === second;
}

function validateCnpj(value: string): boolean {
  if (!/^[A-Z0-9]{12}\d{2}$/.test(value) || /^([A-Z0-9])\1{13}$/.test(value)) return false;
  const characters = value.slice(0, 12).split('').map((character) => character.charCodeAt(0) - 48);
  const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const first = digitFromMod11(characters.reduce((sum, digit, index) => sum + digit * firstWeights[index], 0));
  const second = digitFromMod11(characters.concat(first).reduce((sum, digit, index) => sum + digit * secondWeights[index], 0));
  return value[12] === String(first) && value[13] === String(second);
}

export function normalizeAndValidateTaxIdentifier(input: string): string {
  const value = input.replace(/[.\/-]/g, '').toUpperCase();
  const valid = value.length === 11 ? validateCpf(value) : value.length === 14 && validateCnpj(value);
  if (!valid) {
    throw new UnprocessableEntityException('CPF ou CNPJ inválido. Confira os caracteres e os dígitos verificadores.');
  }
  return value;
}
