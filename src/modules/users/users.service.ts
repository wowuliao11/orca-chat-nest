import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  createOne(data: CreateUserDto) {
    return this.userModel.create(data);
  }

  findOne(username: string) {
    return this.userModel.findOne({ username });
  }
}
