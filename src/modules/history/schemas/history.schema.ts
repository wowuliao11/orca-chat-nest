/* eslint-disable @typescript-eslint/no-this-alias */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class History {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ default: [] })
  history: string[];
}

export const UserSchema = SchemaFactory.createForClass(History);
