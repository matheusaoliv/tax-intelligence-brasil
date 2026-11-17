import { IsEmail, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(12, 128)
  password!: string;

  @IsOptional()
  @IsUUID()
  organizationId?: string;
}
