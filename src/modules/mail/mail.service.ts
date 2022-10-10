import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private logger: Logger = new Logger('AppGateway');
  private transporter;
  constructor() {
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
}
