import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { PriceApiService } from './price.api';

@Module({
  imports: [CacheModule.register()],
  controllers: [PriceController],
  providers: [PriceService, PriceApiService],
})
export class PriceModule {}
