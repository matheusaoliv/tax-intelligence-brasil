import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedRequest, SessionAuthGuard } from '../auth/session-auth.guard';
import { Roles, RolesGuard } from '../rbac/roles.guard';
import { AuditQueryDto } from './dto/audit-query.dto';
import { AuditService } from './audit.service';

@Controller('audit')
@UseGuards(SessionAuthGuard, RolesGuard)
@Roles('OWNER', 'ADMIN', 'ACCOUNTANT')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  list(@Query() query: AuditQueryDto, @Req() request: AuthenticatedRequest) {
    return this.auditService.list(request.user.organizationId, query.limit ?? 50);
  }
}
