import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Room } from 'src/modules/room/schemas/room.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export type HistoryDocument = History & Document;
@Schema({ timestamps: true })
export class History {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  from: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: Room.name, index: true })
  room: Types.ObjectId;

  @Prop({ type: String })
  content: string;
}

export const HistorySchema = SchemaFactory.createForClass(History);
