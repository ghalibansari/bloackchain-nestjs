import { Injectable } from '@nestjs/common';
import { CronService } from './cron.service';
import { Cron } from '@nestjs/schedule';
import { ONE_SECOND } from 'src/app.constant';

@Injectable()
export class CronRunner {
  constructor(private readonly cronService: CronService) {
    setTimeout(async () => {
      // run once when app start
      await this.fetchPrice();
    }, ONE_SECOND * 3);
  }

  @Cron('0 */5 * * * *')
  async fetchPrice() {
    await Promise.allSettled([
      this.cronService.fetchPrice('ETH'),
      this.cronService.fetchPrice('POLYGON'),
    ]);
  }

  @Cron('0 0 * * * *')
  async notifyPriceHikeHourly() {
    await this.cronService.notifyPriceHikeHourly('ETH');
  }
}
