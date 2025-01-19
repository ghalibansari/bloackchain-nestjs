import { Injectable } from '@nestjs/common';
import { CurrencyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PriceService {
  constructor(private readonly prisma: PrismaService) {}

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
}
