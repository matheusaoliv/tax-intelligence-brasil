import { z } from 'zod';

const nonEmptyString = z.string().min(1);
const numericString = z.string().regex(/^\d+(?:\.\d+)?$/);
const dateTime = z.string().datetime({ offset: true });

const regularItem = z.object({
  numero: z.number().int().min(1).max(9_999_999),
  cst: z.string().regex(/^\d{3}$/),
  cClassTrib: z.string().regex(/^\d{6}$/),
  ncm: z.string().optional(),
  nbs: z.string().optional(),
  baseCalculo: z.number().nonnegative().optional(),
  quantidade: z.number().nonnegative().optional(),
  unidade: z.string().optional(),
  impostoSeletivo: z.object({
    cst: z.string().regex(/^\d{3}$/),
    cClassTrib: z.string().regex(/^\d{6}$/),
    baseCalculo: z.number().nonnegative(),
    quantidade: z.number().nonnegative().optional(),
    unidade: z.string().optional(),
    impostoInformado: z.number().nonnegative().optional(),
  }).passthrough().optional(),
  aliquotasNominais: z.object({
    cbs: z.number().nonnegative().max(100).optional(),
    ibsEstadual: z.number().nonnegative().max(100).optional(),
    ibsMunicipal: z.number().nonnegative().max(100).optional(),
    impostoSeletivo: z.object({
      adValorem: z.number().nonnegative().max(100).optional(),
    }).passthrough().optional(),
  }).passthrough().optional(),
}).passthrough();

export const regimeRegularInputSchema = z.object({
  id: nonEmptyString,
  versao: nonEmptyString,
  dhFatoGerador: dateTime.optional(),
  dataHoraEmissao: dateTime.optional(),
  municipio: z.number().int().min(0).max(9_999_999),
  uf: z.string().length(2).optional(),
  tpDoc: z.number().int().min(1).max(999).optional(),
  gCompraGov: z.object({
    tpEnteGov: z.string(),
    tpOperGov: z.string().optional(),
  }).passthrough().optional(),
  itens: z.array(regularItem).min(1),
}).passthrough().refine((value) => Boolean(value.dhFatoGerador || value.dataHoraEmissao), {
  message: 'Informe dhFatoGerador.',
  path: ['dhFatoGerador'],
});

const simplesItem = z.object({
  numero: z.number().int().min(1).optional(),
  cAtivSN: z.string().length(2).optional(),
  cClassTrib: z.string().regex(/^\d{6}$/),
  baseCalculo: numericString,
  valorImpostoSeletivo: numericString,
  pIBSSN: numericString.optional(),
  pCBSSN: numericString.optional(),
}).passthrough();

export const simplesNacionalInputSchema = z.object({
  id: nonEmptyString,
  versao: nonEmptyString,
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tpDoc: nonEmptyString,
  CRT: z.string().regex(/^[1-4]$/),
  tpRegimeIBSCBS: z.string().optional(),
  tpEnteGov: z.string().optional(),
  itens: z.array(simplesItem).min(1),
}).passthrough();

export function validateEngineInput(engine: 'RTC_REGIME_REGULAR' | 'RTC_SIMPLES_NACIONAL', payload: Record<string, unknown>): void {
  const result = engine === 'RTC_REGIME_REGULAR'
    ? regimeRegularInputSchema.safeParse(payload)
    : simplesNacionalInputSchema.safeParse(payload);
  if (!result.success) {
    throw new Error('ENGINE_INPUT_INVALID');
  }
}
