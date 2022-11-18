import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private usersService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.auth.Authorization;

    const jwtUser: any = jwt.verify(
      token?.replace(/(Bearer|bearer)\s/, ''),
      process.env.JWT_SECRET,
    );

    const userDoc = await this.usersService.findOneByKey(jwtUser.id);

    if (!userDoc) return false; // User not exist

    if (typeof context.switchToWs().getData() !== 'object') return false;

    context.switchToWs().getData().user = userDoc; // add property

    return true;
  }
}
