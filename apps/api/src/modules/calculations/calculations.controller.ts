import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedRequest, SessionAuthGuard } from '../auth/session-auth.guard';
import { CreateCalculationDto } from './dto/create-calculation.dto';
import { CalculationsService } from './calculations.service';

@Controller('calculations')
@UseGuards(SessionAuthGuard)
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Post()
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
