import { Module } from '@nestjs/common';
import { CalculationsController } from './calculations.controller';
import { CalculationsService } from './calculations.service';
import { FiscalEngineGateway } from './fiscal-engine.gateway';
import { RolesGuard } from '../rbac/roles.guard';

@Module({
  controllers: [CalculationsController],
  providers: [CalculationsService, FiscalEngineGateway, RolesGuard],
})
export class CalculationsModule {}
