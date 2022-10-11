import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Cache } from 'cache-manager';

@Injectable()
export class MailService {
  private logger: Logger = new Logger('AppGateway');
  private transporter;
  constructor(@Inject(CACHE_MANAGER) private cacher: Cache) {
    (async () => {
      this.transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
          user: process.env.EMAIL_USERNAME, // generated ethereal user
          pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
      });
    })();
  }

  async sendEmail({
    from = 'ORCA 🐳',
    to,
    subject,
    html = '<h1>🐳</h1><b>Hello friend👽!</b>',
  }: {
    from?: string;
    to: string;
    subject: string;
    html?: string;
  }) {
    this.transporter
      .sendMail({
        from: `"${from}" <>${process.env.EMAIL_USERNAME}`, // sender address
        to, // list of receivers

        subject, // Subject line
        text: JSON.stringify(html), // plain text body
        html, // html body
      })
      .catch((err) => this.logger.error(err));
    return 'sending...';
  }

  async sendVerificationCode(to: string) {
    const randomCode = (Math.random() + 1)
      .toString(36)
      .substring(7)
      .toLocaleUpperCase();

    this.transporter // 异步发送
      .sendMail({
        from: `"ORCA-CHAT 🐳" <>${process.env.EMAIL_USERNAME}`, // sender address
        to, // list of receivers

        subject: 'Sign Up Verification Code', // Subject line
        text: 'Your  Code is: ' + randomCode, // plain text body
        html: '<h4>' + 'Your Code is: ' + randomCode + '</h4>', // html body
      })
      .catch((err) => this.logger.error(err));

    return this.cacher.set('SIGN_UP_VERIFICTION_CODE:' + to, randomCode, {
      ttl: 600,
    });
  }
}
