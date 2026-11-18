import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { IsDateString, IsString, Matches } from 'class-validator';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { ReferenceDataGateway } from './reference-data.gateway';

class CodeAndDateQuery {
  @IsDateString({ strict: true })
  data!: string;
}

class NcmQuery extends CodeAndDateQuery {
  @IsString()
  @Matches(/^\d{8}$/)
  ncm!: string;
}

class UfRateQuery extends CodeAndDateQuery {
  @IsString()
  @Matches(/^\d{1,2}$/)
  codigoUf!: string;
}

@Controller('reference-data')
@UseGuards(SessionAuthGuard)
export class ReferenceDataController {
  constructor(private readonly gateway: ReferenceDataGateway) {}

  @Get('regime-regular/classificacoes-tributarias/cbs-ibs/class-trib/:code')
  classification(@Param('code') code: string, @Query() query: CodeAndDateQuery) {
    if (!/^\d{6}$/.test(code)) throw new Error('Código de classificação inválido.');
    return this.gateway.getRegimeRegular(
      'classificacoes-tributarias/cbs-ibs/class-trib/' + code,
      { data: query.data },
    );
  }

  @Get('regime-regular/fundamentacoes-legais')
  legalBasis(@Query() query: CodeAndDateQuery) {
    return this.gateway.getRegimeRegular('fundamentacoes-legais', { data: query.data });
  }

  @Get('regime-regular/ncm')
  ncm(@Query() query: NcmQuery) {
    return this.gateway.getRegimeRegular('ncm', { ncm: query.ncm, data: query.data });
  }

  @Get('regime-regular/aliquota-uf')
  stateRate(@Query() query: UfRateQuery) {
    return this.gateway.getRegimeRegular('aliquota-uf', { codigoUf: query.codigoUf, data: query.data });
  }

  @Get('simples-nacional/atividades')
  simplesActivities(@Query() query: CodeAndDateQuery) {
    return this.gateway.getSimplesNacional('atividades', { data: query.data });
  }
}
