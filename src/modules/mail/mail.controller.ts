import { Body, Controller, Post } from '@nestjs/common';
import { SendMailDto } from './dto/send-mail.dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post()
  sendMail(@Body() body: SendMailDto) {
    const { to, subject, html } = body;
    return this.mailService.sendEmail({ to, subject, html });
  }
}
