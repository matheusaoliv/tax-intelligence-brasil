import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { TaxIdentifierCryptoService } from './tax-identifier-crypto.service';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, TaxIdentifierCryptoService],
})
export class CompaniesModule {}
