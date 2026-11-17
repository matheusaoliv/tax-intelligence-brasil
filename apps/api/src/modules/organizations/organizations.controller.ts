import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedRequest, SessionAuthGuard } from '../auth/session-auth.guard';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
@UseGuards(SessionAuthGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('current')
  getCurrent(@Req() request: AuthenticatedRequest) {
    return this.organizationsService.getCurrent(request.user.organizationId, request.user.role);
  }
}
