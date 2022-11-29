/* eslint-disable @typescript-eslint/no-this-alias */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

@Schema()
export class Member {
  @Prop({ ref: User.name, type: Types.ObjectId })
  user: Types.ObjectId;

  @Prop({})
  alias: string;
}
@Schema()
export class Room {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({})
  describe: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop([{ type: Member }])
  members: Member[];
}
export type RoomDocument = Room & Document;
export const RoomSchema = SchemaFactory.createForClass(Room);
