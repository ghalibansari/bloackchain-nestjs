import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './create-alert.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlertService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAlertDto: CreateAlertDto) {
    await this.prisma.alert.create({ data: createAlertDto });
    return 'success';
  }
}
