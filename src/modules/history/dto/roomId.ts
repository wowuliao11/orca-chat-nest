import { Type, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ObjectId, Types } from 'mongoose';
import { objectIdTransformer } from 'src/utils/tools.utils';

export class RoomIdDto {
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  @Transform((bar) => objectIdTransformer(bar.value, bar.key))
  roomId: ObjectId;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageIndex: number;
}
