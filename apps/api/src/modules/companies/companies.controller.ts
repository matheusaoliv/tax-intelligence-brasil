import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedRequest, SessionAuthGuard } from '../auth/session-auth.guard';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Controller('companies')
@UseGuards(SessionAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() input: CreateCompanyDto, @Req() request: AuthenticatedRequest) {
    return this.companiesService.create(input, request.user);
  }

  @Get()
  list(@Req() request: AuthenticatedRequest) {
    return this.companiesService.list(request.user.organizationId);
  }

  @Get(':id')
  getById(@Param('id', new ParseUUIDPipe()) id: string, @Req() request: AuthenticatedRequest) {
    return this.companiesService.getById(id, request.user.organizationId);
  }
}
