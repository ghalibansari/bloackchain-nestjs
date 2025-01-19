import { Injectable } from '@nestjs/common';
import { CronService } from './cron.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronRunner {
  constructor(private readonly cronService: CronService) {
    setTimeout(async () => {
      await this.fetchPrice();
    }, 2000);
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
