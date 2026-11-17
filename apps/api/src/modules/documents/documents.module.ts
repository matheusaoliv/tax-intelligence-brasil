import { Module } from '@nestjs/common';
import { RolesGuard } from '../rbac/roles.guard';
import { DanfseGateway } from './danfse.gateway';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { ObjectStorageService } from './object-storage.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, DanfseGateway, ObjectStorageService, RolesGuard],
})
export class DocumentsModule {}
