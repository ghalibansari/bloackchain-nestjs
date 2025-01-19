import { Injectable, Logger } from '@nestjs/common';
import { CurrencyType, Prisma } from '@prisma/client';
import axios from 'axios';
import * as dayjs from 'dayjs';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiResponse } from './cron.type';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async fetchPrice(type: CurrencyType) {
    const lastRecord = await this.prisma.price.findFirst({
      select: { timestamp: true },
      where: { type },
      orderBy: { timestamp: 'desc' },
    });

    this.logger.log(`Last record for ${type}: ${JSON.stringify(lastRecord)}`);
    const startTime = lastRecord
      ? dayjs(lastRecord.timestamp)
      : dayjs().subtract(1, 'd');
    const endTime = dayjs();

    let chain: string;
    switch (type) {
      case CurrencyType.ETH:
        chain = 'eth';
        break;
      case CurrencyType.POLYGON:
        chain = 'polygon';
        break;
      default:
        throw new Error(`chain ${type} not implemented`);
    }

    const params = new URLSearchParams({
      chain,
      timeframe: '5min',
      currency: 'usd',
      fromDate: startTime.toISOString(),
      toDate: endTime.toISOString(),
    });

    const { data } = await axios.get<ApiResponse>(
      `https://deep-index.moralis.io/api/v2.2/pairs/0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640/ohlcv?${params.toString()}`,
      {
        headers: {
          accept: 'application/json',
          'X-API-Key': process.env.MOLARIS_API_KEY,
        },
      },
    );

    const prices: Prisma.priceCreateInput[] = data.result.map((data) => {
      return { ...data, type };
    });

    this.logger.log(`${prices.length} ${type} saved in db`);
    await this.prisma.price.createMany({ data: prices });
  }

  async notifyPriceHikeHourly(type?: CurrencyType) {
    const currentPrice = await this.prisma.price.findFirst({
      where: { type },
      orderBy: { timestamp: 'desc' },
    });

    if (!currentPrice) {
      this.logger.log(`Current price not found`);
      return;
    }

    // Get price from 1 hour ago
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const previousPrice = await this.prisma.price.findFirst({
      where: { type, timestamp: { lte: oneHourAgo } },
      orderBy: { timestamp: 'desc' },
    });

    if (!previousPrice) return;

    // Calculate price increase percentage
    const priceIncrease =
      ((currentPrice.close - previousPrice.close) / previousPrice.close) * 100;

    // If price increased by more than 3%, send email notification
    if (priceIncrease > 3) {
      await this.emailService.sendEmail({
        to: ['hyperhire_assignment@hyperhire.in'],
        subject: `${type} Price Alert: 3% Increase`,
        body:
          `The price of ${type} has increased by ${priceIncrease.toFixed(2)}% in the last hour.\n\n` +
          `Previous price: ${previousPrice.close}\n` +
          `Current price: ${currentPrice.close}`,
      });
    }
  }

  async notifyPriceAlert(type: CurrencyType, lastPrice: number) {
    const where = {
      type,
      value: { gte: lastPrice - 0.2, lte: lastPrice + 0.2 },
    };
    this.logger.log(
      `Fetching alerts for ${type} with price range: ${lastPrice - 0.2} to ${lastPrice + 0.2}`,
    );
    const data = await this.prisma.alert.findMany({ where });

    this.logger.log(
      `Notifying ${data.length} users about the price alert for ${type}`,
    );
    for await (const d of data) {
      await this.emailService.sendEmail({
        to: [d.email],
        subject: 'price alert',
        body: `The price of ${type} has reached ${lastPrice}. This matches your alert criteria.`,
      });
    }
  }
}
