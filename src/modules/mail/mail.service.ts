import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private testAccount;
  private transporter;
  constructor() {
    (async () => {
      this.testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        service: 'Outlook365',
        auth: {
          user: 'wowuliao@outlook.com', // generated ethereal user
          pass: 'kuaileme11', // generated ethereal password
        },
      });
    })();
  }

  async sendEmail() {
    const info = await this.transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: '286370787@qq.com', // list of receivers

      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: '<b>Hello world?</b>', // html body
    });
    return info;
  }
}
