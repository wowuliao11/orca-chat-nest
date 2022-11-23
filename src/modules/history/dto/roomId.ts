import { Type, Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { ObjectId, Types } from 'mongoose';
import { objectIdTransformer } from 'src/utils/tools.utils';

export class RoomIdDto {
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  @Transform((bar) => objectIdTransformer(bar.value, bar.key))
  roomId: ObjectId;
}
