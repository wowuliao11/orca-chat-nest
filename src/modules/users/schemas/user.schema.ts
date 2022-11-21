/* eslint-disable @typescript-eslint/no-this-alias */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { ObjectId } from 'mongoose';
import Role from 'src/config/roles';

const SALT_WORK_FACTOR = 10;

export type UserDocument = User & Document;
@Schema({ timestamps: true })
export class User {
  _id: ObjectId;
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, type: Array<Role>, default: [Role.USER] })
  roles: Array<string>;

  @Prop({})
  avatar: string; // 头像

  @Prop({ unique: true })
  nick: string;

  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('save', function (next) {
  const user = this;

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.loadClass(User);
