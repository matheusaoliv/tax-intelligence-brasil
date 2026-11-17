import { FiscalEngine } from '@prisma/client';
import { regimeRegularInputSchema, simplesNacionalInputSchema, validateEngineInput } from './engine-input.schemas';

describe('upstream engine input contracts', () => {
  const regularFixture = {
    id: '6194602ea71cbf9431c236de4409d920',
    versao: '1.0.0',
    dhFatoGerador: '2027-03-10T10:00:00-03:00',
    municipio: 4314902,
    uf: 'RS',
    itens: [{
      numero: 1,
      ncm: '10063021',
      cst: '200',
      cClassTrib: '200003',
      baseCalculo: 100,
      quantidade: 20,
      unidade: 'KG',
      aliquotasNominais: { cbs: 8.8, ibsEstadual: 0.05, ibsMunicipal: 0.05 },
    }],
  };

  it('accepts a documented Regime Regular payload', () => {
    expect(regimeRegularInputSchema.safeParse(regularFixture).success).toBe(true);
    expect(() => validateEngineInput(FiscalEngine.RTC_REGIME_REGULAR, regularFixture)).not.toThrow();
  });

  it('rejects a Regime Regular payload missing the fact date', () => {
    const { dhFatoGerador: _date, ...invalid } = regularFixture;
    expect(regimeRegularInputSchema.safeParse(invalid).success).toBe(false);
  });

  it('accepts the official Simples Nacional field structure', () => {
    const fixture = {
      id: 'calc-001',
      versao: '2.0.0',
      data: '2027-03-15',
      tpDoc: '55',
      CRT: '1',
      itens: [{
        numero: 1,
        cAtivSN: '01',
        cClassTrib: '000001',
        baseCalculo: '950.00',
        valorImpostoSeletivo: '0.00',
        pIBSSN: '1.25',
        pCBSSN: '2.75',
      }],
    };
    expect(simplesNacionalInputSchema.safeParse(fixture).success).toBe(true);
  });

  it('rejects invalid Simples Nacional classification codes', () => {
    const fixture = {
      id: 'calc-001', versao: '2.0.0', data: '2027-03-15', tpDoc: '55', CRT: '1',
      itens: [{ cClassTrib: 'ABC', baseCalculo: '950.00', valorImpostoSeletivo: '0.00' }],
    };
    expect(simplesNacionalInputSchema.safeParse(fixture).success).toBe(false);
  });
});
