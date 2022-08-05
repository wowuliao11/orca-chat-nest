import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3002, { cors: { origin: '*' } })
export class WsStartGateway {
  logger = new Logger();

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('hello')
  hello(@MessageBody() data: any): any {
    console.log('here', data);
    return {
      event: 'hello',
      data: 'i send you this 🐳',
      msg: 'rustfisher.com',
    };
  }

  @SubscribeMessage('hello2')
  hello2(@MessageBody() data: any, @ConnectedSocket() client): any {
    console.log('收到消息 client:', client);
    client.send(JSON.stringify({ event: 'tmp', data: '这里是个临时信息' }));
    return { event: 'hello2', data: data };
  }

  async PublicMessageforARoom(roomid: string) {
    Object.keys(this.server.engine.clients).forEach((key) =>
      console.log('key is :', key, this.server.engine.clients[key].server),
    );
    const key0 = Object.keys(this.server.engine.clients)[0];
    console.log(key0);
    const result = await this.server.engine.clients[key0].server.emit(
      'hello-event',
      'hi',
    );

    console.log(result);

    // return this.server.to(roomid).emit('hello-event', 'hello everyone');
  }

  PublicMessage(message: string): void {
    console.log('client number', this.server.engine.clinets);
    this.server.emit('hello2', `我是服务端发来的消息${message}`);
    this.server.send({
      event: 'hello2',
      message: `我是服务端发来的消息${message}`,
    });
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
