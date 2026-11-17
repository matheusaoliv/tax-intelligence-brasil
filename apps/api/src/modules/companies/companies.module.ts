import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { TaxIdentifierCryptoService } from './tax-identifier-crypto.service';
import { RolesGuard } from '../rbac/roles.guard';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, TaxIdentifierCryptoService, RolesGuard],
})
export class CompaniesModule {}
