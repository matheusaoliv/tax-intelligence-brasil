import { FiscalEngine } from '@prisma/client';
import { IsIn, IsObject, IsOptional, IsUUID } from 'class-validator';

export class CreateCalculationDto {
  @IsIn([FiscalEngine.RTC_REGIME_REGULAR, FiscalEngine.RTC_SIMPLES_NACIONAL])
  engine!: FiscalEngine;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsObject()
  inputPayload!: Record<string, unknown>;
}
