import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async validateUser(loginKey: string, pass: string): Promise<any> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const user = await this.usersService
        .findOneByKey(loginKey)
        .session(session);

      if (!user)
        throw new HttpException(
          'Wrong username or password!🙅‍♂️',
          HttpStatus.FORBIDDEN,
        );

      const isUser = await user.comparePassword(pass);
      await session.commitTransaction();
      return isUser ? user : null;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }
  async login(user) {
    const payload = { username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
