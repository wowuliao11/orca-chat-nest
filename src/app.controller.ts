import { Controller, Get } from '@nestjs/common';
import { AppGateway } from './modules/ws/ws.gateway';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly gateway: AppGateway,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
