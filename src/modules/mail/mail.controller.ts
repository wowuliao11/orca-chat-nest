import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { SendMailDto } from './dto/send-mail.dto';
import { SendVerificationCode } from './dto/send-verification-code.dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post()
  async sendMail(@Body() body: SendMailDto) {
    const { to, subject, html } = body;

    return this.mailService.sendEmail({ to, subject, html });
  }

  @Public()
  @Post('verificationCode')
  async sendVerificationCode(@Body() body: SendVerificationCode) {
    const { to } = body;

    return this.mailService.sendVerificationCode(to);
  }
}
