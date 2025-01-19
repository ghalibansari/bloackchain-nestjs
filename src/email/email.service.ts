import { Injectable } from '@nestjs/common';
import { SendEmail } from './email.type';

@Injectable()
export class EmailService {
  async sendEmail(data: SendEmail) {
    console.log(`sending email ${JSON.stringify(data)}`);
  }
}
