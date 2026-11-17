import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(2, 120)
  displayName!: string;

  @IsString()
  @Length(2, 160)
  organizationName!: string;

  @IsString()
  @MinLength(12)
  @Length(12, 128)
  password!: string;
}
