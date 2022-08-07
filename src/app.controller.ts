import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { WsStartGateway } from './ws.gateway';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly gateway: WsStartGateway,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/send')
  send() {
    // this.gateway.PublicMessage('🐯');
    this.gateway.PublicMessageforARoom('bzm-room');
    return 'send';
  }
}
