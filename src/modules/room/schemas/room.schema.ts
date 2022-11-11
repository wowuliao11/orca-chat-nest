/* eslint-disable @typescript-eslint/no-this-alias */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Room {
  @Prop({ required: true })
  title: string;

  @Prop({})
  describe: string;

  @Prop({ default: '' })
  avatar: string;
}
export type RoomDocument = Room & Document;
export const RoomSchema = SchemaFactory.createForClass(Room);
