import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendVerificationCode {
  @IsNotEmpty()
  @IsEmail()
  to: string;
}
