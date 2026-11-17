import { Module } from '@nestjs/common';
import { CalculationsController } from './calculations.controller';
import { CalculationsService } from './calculations.service';
import { FiscalEngineGateway } from './fiscal-engine.gateway';

@Module({
  controllers: [CalculationsController],
  providers: [CalculationsService, FiscalEngineGateway],
})
export class CalculationsModule {}
