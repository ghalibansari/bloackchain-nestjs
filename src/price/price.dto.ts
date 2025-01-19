import { ApiProperty } from '@nestjs/swagger';
import { CurrencyType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class PriceType {
  @ApiProperty({
    description: 'The currency type for the alert',
    enum: CurrencyType,
    example: 'ETH',
  })
  @IsString()
  @IsEnum(CurrencyType)
  type: CurrencyType;
}
