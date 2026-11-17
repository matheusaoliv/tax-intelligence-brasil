import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedRequest, SessionAuthGuard } from '../auth/session-auth.guard';
import { Roles, RolesGuard } from '../rbac/roles.guard';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
@UseGuards(SessionAuthGuard, RolesGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('current')
  getCurrent(@Req() request: AuthenticatedRequest) {
    return this.organizationsService.getCurrent(request.user.organizationId, request.user.role);
  }

  @Get('current/members')
  listMembers(@Req() request: AuthenticatedRequest) {
    return this.organizationsService.listMembers(request.user.organizationId);
  }

  @Post('current/members')
  @Roles('OWNER', 'ADMIN')
  addMember(@Body() input: CreateMembershipDto, @Req() request: AuthenticatedRequest) {
    return this.organizationsService.addMember(input, request.user);
  }
}
