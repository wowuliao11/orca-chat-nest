import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { Transform, Type } from 'class-transformer';
import { objectIdTransformer } from '../../../utils/tools.utils';

export class CreateHistoryDto {
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  @Transform((bar) => objectIdTransformer(bar.value, bar.key))
  from: Types.ObjectId;

  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  @Transform((bar) => objectIdTransformer(bar.value, bar.key))
  room: Types.ObjectId;

  @IsString()
  content: string;
}
