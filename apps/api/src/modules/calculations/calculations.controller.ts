import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthenticatedRequest, SessionAuthGuard } from '../auth/session-auth.guard';
import { Roles, RolesGuard } from '../rbac/roles.guard';
import { CreateCalculationDto } from './dto/create-calculation.dto';
import { CalculationsService } from './calculations.service';

@Controller('calculations')
@UseGuards(SessionAuthGuard, RolesGuard)
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Post()
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @Roles('OWNER', 'ADMIN', 'ACCOUNTANT', 'OPERATOR')
  create(@Body() input: CreateCalculationDto, @Req() request: AuthenticatedRequest) {
    return this.calculationsService.create(input, request.user);
  }

  @Get()
  list(@Req() request: AuthenticatedRequest) {
    return this.calculationsService.list(request.user.organizationId);
  }

  @Get(':id')
  getById(@Param('id', new ParseUUIDPipe()) id: string, @Req() request: AuthenticatedRequest) {
    return this.calculationsService.getById(id, request.user.organizationId);
  }
}
