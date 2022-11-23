import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private usersService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToWs();
    const client = ctx.getClient();
    const token = client.handshake.auth.Authorization;

    const jwtUser: any = jwt.verify(
      token?.replace(/(Bearer|bearer)\s/, ''),
      process.env.JWT_SECRET,
    );

    const userDoc = await this.usersService.findOneByKey(jwtUser.id);

    if (!userDoc) return false; // User not exist

    if (typeof ctx.getData() !== 'object') return false;

    ctx.getData().user = userDoc.toObject(); // add property

    return true;
  }
}
