import { IsEmail, IsIn } from 'class-validator';

export class CreateMembershipDto {
  @IsEmail()
  email!: string;

  @IsIn(['ADMIN', 'ACCOUNTANT', 'OPERATOR', 'VIEWER'])
  role!: 'ADMIN' | 'ACCOUNTANT' | 'OPERATOR' | 'VIEWER';
}
