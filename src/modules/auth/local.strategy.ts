import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'loginKey' });
  }

  async validate(loginKey: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(loginKey, password);
    if (!user) {
      throw new HttpException(
        'Wrong username or password!🙅‍♂️',
        HttpStatus.FORBIDDEN,
      );
    }
    return user;
  }
}
