import { IsString, Length, Matches } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @Length(2, 180)
  legalName!: string;

  @IsString()
  @Length(11, 18)
  @Matches(/^[A-Za-z0-9.\/-]+$/, {
    message: 'Informe CPF ou CNPJ em formato válido.',
  })
  taxIdentifier!: string;
}
