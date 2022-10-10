import { IsNotEmpty, IsOptional } from 'class-validator';

export class SendMailDto {
  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  subject: string;

  @IsOptional()
  html: string;
}
