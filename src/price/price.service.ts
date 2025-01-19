import { BadRequestException, Injectable } from '@nestjs/common';
import { CurrencyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PriceApiService } from './price.api';
import { ConversionDto } from './price.dto';

const ETH_FEE = 0.03;
@Injectable()
export class PriceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly priceApiService: PriceApiService,
  ) {}

  async fetchPrice24Hours(type: CurrencyType) {
    const hours = [];

    const startTime = new Date(new Date().setMinutes(0, 0, 0));
    const endTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let time = startTime;

    while (true) {
      if (new Date(time) < endTime) {
        break;
      }
      const currentTime = time.getTime() - 60 * 60 * 1000;
      hours.push(new Date(currentTime).toISOString());
      time = new Date(currentTime);
    }

    const data = await this.prisma.price.findMany({
      where: { type, OR: hours.map((hour) => ({ timestamp: hour })) },
    });

    return data;
  }

  async conversion({ value }: ConversionDto) {
    try {
      const rates = await this.priceApiService.getPrices();
      const ethUsd = rates['ETH'];
      const btcUsd = rates['BTC'];

      if (!ethUsd || !btcUsd) {
        throw new BadRequestException(
          `Current rate not found eth:${ethUsd}, btc:${btcUsd}`,
        );
      }

      const conversionFee = value * ETH_FEE;
      const totalValueInUsd = value * ethUsd;
      const valueInBtc = totalValueInUsd / btcUsd;
      const totalBtc = valueInBtc - conversionFee;
      return { total: totalBtc, fee: conversionFee, btc: valueInBtc };
    } catch (e) {
      throw new BadRequestException('Invalid request');
    }
  }
}
