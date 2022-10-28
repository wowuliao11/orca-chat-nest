import { PartialType, OmitType } from '@nestjs/mapped-types';

import { CreateUserDto } from './create.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['verificationCode'] as const),
) {}
