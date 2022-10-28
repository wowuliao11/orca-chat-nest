import { IsOptional } from 'class-validator';

export class EditProfileDto {
  @IsOptional()
  avatar: string;

  @IsOptional()
  nick: string;
}
