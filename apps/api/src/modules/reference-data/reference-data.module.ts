import { Module } from '@nestjs/common';
import { ReferenceDataController } from './reference-data.controller';
import { ReferenceDataGateway } from './reference-data.gateway';

@Module({
  controllers: [ReferenceDataController],
  providers: [ReferenceDataGateway],
})
export class ReferenceDataModule {}
