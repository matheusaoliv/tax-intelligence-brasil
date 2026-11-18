import { IsDateString } from 'class-validator';

export class ReferenceDateDto {
  @IsDateString({ strict: true })
  data!: string;
}
