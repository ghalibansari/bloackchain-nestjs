import { Injectable, Logger } from '@nestjs/common';
import { CronService } from './cron.service';
import { Cron } from '@nestjs/schedule';
import { ONE_SECOND } from 'src/app.constant';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CronRunner {
  private logger = new Logger(CronRunner.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly cronService: CronService,
  ) {
    setTimeout(async () => {
      // run once when app start
      await this.fetchPrice().catch((e) =>
        console.error(`Failed to fetch price: ${e.message} in setTimeout`),
      );
    }, ONE_SECOND * 3);
  }

  @Cron('0 */5 * * * *')
  async fetchPrice() {
    await Promise.allSettled([
      this.cronService.fetchPrice('ETH'),
      this.cronService.fetchPrice('POLYGON'),
    ]);

    const [ethPrice, polygonPrice] = await Promise.all([
      this.prisma.price.findFirst({
        where: { type: 'ETH' },
        select: { close: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.price.findFirst({
        where: { type: 'POLYGON' },
        select: { close: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    if (!ethPrice || !polygonPrice) {
      this.logger.error(
        `Failed to fetch price for one or more currencies. eth:${JSON.stringify(ethPrice)}, polygon: ${JSON.stringify(polygonPrice)}`,
      );
    }

    await Promise.allSettled([
      ethPrice && this.cronService.notifyPriceAlert('ETH', ethPrice.close),
      polygonPrice &&
        this.cronService.notifyPriceAlert('POLYGON', polygonPrice.close),
    ]);
  }

  @Cron('0 0 * * * *')
  async notifyPriceHikeHourly() {
    await this.cronService.notifyPriceHikeHourly('ETH');
  }
}
