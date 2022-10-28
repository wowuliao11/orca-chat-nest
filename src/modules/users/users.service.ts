import { User, UserDocument } from './schemas/user.schema';
import { isValidObjectId, Model, ObjectId } from 'mongoose';
import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private cacher: Cache,
  ) {}

  async updateOne({
    id,
    user,
  }: {
    id: string | ObjectId;
    user: UpdateUserDto;
  }) {
    return this.userModel.findOneAndUpdate({ _id: id }, user, {
      returnOriginal: false,
    });
  }

  async registe(data: CreateUserDto) {
    const verificationCode = await this.cacher.get(
      'SIGN_UP_VERIFICTION_CODE:' + data.email,
    );

    if (!verificationCode)
      // 检验是否发送验证码
      throw new HttpException(
        'Please get the verification code first!',
        HttpStatus.BAD_REQUEST,
      );

    if (verificationCode !== data.verificationCode)
      // 检验验证码是否正确
      throw new HttpException(
        'Verification code is not matching!',
        HttpStatus.BAD_REQUEST,
      );

    const alreadyUser = await this.userModel.findOne({
      $or: [{ username: data.username }, { email: data.email }],
    });
    if (alreadyUser)
      throw new HttpException(
        'Username or email is already exist!',
        HttpStatus.CONFLICT,
      );

    return this.userModel.create(data);
  }

  findOneByKey(loginKey: string) {
    return this.userModel.findOne({
      $or: [
        { username: loginKey },
        { email: loginKey },
        { _id: isValidObjectId(loginKey) ? loginKey : null },
      ],
    });
  }
}
