import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AlertModule } from './alert/alert.module';
import { CronModule } from './cron/cron.module';
import { EmailModule } from './email/email.module';
import { PriceModule } from './price/price.module';

@Module({
  imports: [PrismaModule, AlertModule, CronModule, EmailModule, PriceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
