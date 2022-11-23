import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import {
  Logger,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { WsJwtGuard } from '../auth/jwt-ws-auth.guard';
import { RoomService } from '../room/room.service';
import { ReceiveMessageDto } from './dto/receive-message.dto';
import { WebsocketExceptionsFilter } from 'src/filters/ws-exception.filter';
import { User } from '../users/schemas/user.schema';
import { HistoryService } from '../history/history.service';
import { Types } from 'mongoose';

const MSG_TO_CLINET = 'MSG_TO_CLINET';
const MSG_TO_SERVER = 'MSG_TO_SERVER';
const JOIN_FLAG = 'JOIN';

class ReceiveMessageBody extends ReceiveMessageDto {
  user: User;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private roomService: RoomService,
    private readonly historyService: HistoryService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(MSG_TO_SERVER)
  @UseFilters(WebsocketExceptionsFilter)
  @UsePipes(new ValidationPipe({}))
  async handleMessage(client, data: ReceiveMessageBody) {
    const room = await this.roomService.findOne({ _id: data.room });

    if (!room) throw new WsException('No this room:' + data.room);

    this.server.in(room._id.toString()).emit(MSG_TO_CLINET, {
      message: data.message,
      user: data.user,
      time: new Date(),
    });

    this.historyService.create({
      from: new Types.ObjectId(data.user?._id?.toString()),
      room: new Types.ObjectId(data.room),
      content: data.message,
    });
    return data;
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(JOIN_FLAG)
  @UseFilters(WebsocketExceptionsFilter)
  async handleJoin(client: Socket, data) {
    client.join(data.roomId);
    return;
  }

  afterInit() {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsJwtGuard)
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    console.log();
  }
}
