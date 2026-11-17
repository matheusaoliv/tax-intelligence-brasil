import { IsBoolean, IsIn, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateDanfseDto {
  @IsString()
  @MinLength(20)
  @MaxLength(33_554_432)
  xml!: string;

  @IsOptional()
  @IsIn(['0', '1', '2'])
  stc?: '0' | '1' | '2';

  @IsOptional()
  @IsBoolean()
  canhoto?: boolean;

  @IsOptional()
  @IsUUID()
  companyId?: string;
}
