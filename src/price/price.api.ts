import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { CoinLayerResponse, Rates } from './price.type';
import { ONE_MINUTE } from 'src/app.constant';

const RATES_KEY = 'rates';

@Injectable()
export class PriceApiService {
  private readonly logger = new Logger(PriceApiService.name);
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getPrices(): Promise<Rates> {
    const rates = (await this.cacheManager.get(RATES_KEY)) as string;
    if (rates) {
      this.logger.verbose(`Rates fetched from cache: ${JSON.stringify(rates)}`);
      return JSON.parse(rates) as Rates;
    }

    const { data } = await axios.get<CoinLayerResponse>(
      `https://api.coinlayer.com/live?access_key=${process.env.COIN_LAYER_API_KEY}`,
    );

    if (!data.success === true) {
      throw new Error('Failed to fetch prices from the API');
    }

    this.logger.verbose(
      `Current rates fetched from api: ${JSON.stringify(data.rates)}`,
    );
    await this.cacheManager.set(
      RATES_KEY,
      JSON.stringify(data.rates),
      ONE_MINUTE * 5,
    );
    return data.rates;
  }
}
