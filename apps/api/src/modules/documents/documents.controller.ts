import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthenticatedRequest, SessionAuthGuard } from '../auth/session-auth.guard';
import { Roles, RolesGuard } from '../rbac/roles.guard';
import { CreateDanfseDto } from './dto/create-danfse.dto';
import { DocumentsService } from './documents.service';

@Controller('documents')
@UseGuards(SessionAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('danfse')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Roles('OWNER', 'ADMIN', 'ACCOUNTANT', 'OPERATOR')
  createDanfse(@Body() input: CreateDanfseDto, @Req() request: AuthenticatedRequest) {
    return this.documentsService.createDanfse(input, request.user);
  }

  @Get()
  list(@Req() request: AuthenticatedRequest) {
    return this.documentsService.list(request.user.organizationId);
  }

  @Get(':id/download')
  createDownloadUrl(@Param('id', new ParseUUIDPipe()) id: string, @Req() request: AuthenticatedRequest) {
    return this.documentsService.createDownloadUrl(id, request.user.organizationId);
  }
}
