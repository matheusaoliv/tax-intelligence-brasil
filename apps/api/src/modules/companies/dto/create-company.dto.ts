import { IsString, Length, Matches } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @Length(2, 180)
  legalName!: string;

  @IsString()
  @Matches(/^(?:\d{11}|\d{14})$/, {
    message: 'Informe CPF ou CNPJ somente com números.',
  })
  taxIdentifier!: string;
}
