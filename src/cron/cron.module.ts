import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CronRunner } from './cron.runner';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CronRunner, CronService],
})
export class CronModule {}
