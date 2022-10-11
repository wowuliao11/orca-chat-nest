import { IsNotEmpty, Length, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(4, 16)
  username: string;

  @IsNotEmpty()
  @MaxLength(32)
  password: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  verificationCode: string;
}
