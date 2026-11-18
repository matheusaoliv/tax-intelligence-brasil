import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { CalculationsModule } from './calculations/calculations.module';
import { CompaniesModule } from './companies/companies.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { DocumentsModule } from './documents/documents.module';
import { AuditModule } from './audit/audit.module';
import { ReferenceDataModule } from './reference-data/reference-data.module';

@Module({
  imports: [
    DatabaseModule,
    HealthModule,
    AuthModule,
    CalculationsModule,
    CompaniesModule,
    OrganizationsModule,
    DocumentsModule,
    AuditModule,
    ReferenceDataModule,
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
