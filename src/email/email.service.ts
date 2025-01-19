import { Injectable, Logger } from '@nestjs/common';
import { SendEmail } from './email.type';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendEmail(data: SendEmail) {
    this.logger.log(`sending email ${JSON.stringify(data)}\n`);
  }
}
