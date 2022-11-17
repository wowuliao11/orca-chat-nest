import { IsNotEmpty } from 'class-validator';

class MemberDto {
  @IsNotEmpty()
  user: string;

  alias: string;
}

export class CreateRoomDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  describe: string[];

  @IsNotEmpty()
  avatar: string;

  members: MemberDto[];
}
