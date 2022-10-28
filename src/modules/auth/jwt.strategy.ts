import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ id }: { id: string }) {
    const user = await this.usersService.findOneByKey(id);

    return {
      id: user?._id || '',
      roles: user?.roles || [],
      nick: user.nick || 'unknowname',
      username: user?.username || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
    };
  }
}
