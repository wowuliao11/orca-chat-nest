import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (!user)
      throw new HttpException(
        'Wrong username or password!🙅‍♂️',
        HttpStatus.FORBIDDEN,
      );

    const isUser = await user.comparePassword(pass);
    return isUser ? user : null;
  }
  async login(user) {
    const payload = { username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
