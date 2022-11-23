import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { Transform, Type } from 'class-transformer';
import { objectIdTransformer } from '../../../utils/tools.utils';

export class ReceiveMessageDto {
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  @Transform((bar) => objectIdTransformer(bar.value, bar.key))
  room: Types.ObjectId;
}
