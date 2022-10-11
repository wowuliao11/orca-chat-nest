import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
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

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private cacher: Cache,
  ) {}

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

    return this.userModel.create(data);
  }

  findOneByKey(loginKey: string) {
    return this.userModel.findOne({
      $or: [{ username: loginKey }, { email: loginKey }],
    });
  }
}
