import { z } from 'zod';

export const tenantContextSchema = z.object({
  organizationId: z.string().uuid(),
  userId: z.string().uuid(),
  correlationId: z.string().min(8).max(128),
});

export const engineIdentitySchema = z.object({
  engine: z.enum(['rtc-regime-regular', 'rtc-simples-nacional', 'danfse']),
  repository: z.string().url(),
  commitSha: z.string().regex(/^[a-f0-9]{40}$/i),
  version: z.string().min(1),
});

export const fiscalCalculationRecordSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  engine: engineIdentitySchema,
  input: z.unknown(),
  originalOutput: z.unknown(),
  createdAt: z.string().datetime(),
  correlationId: z.string().min(8).max(128),
});

export type TenantContext = z.infer<typeof tenantContextSchema>;
export type EngineIdentity = z.infer<typeof engineIdentitySchema>;
export type FiscalCalculationRecord = z.infer<typeof fiscalCalculationRecordSchema>;
