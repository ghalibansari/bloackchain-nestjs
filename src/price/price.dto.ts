import { ApiProperty } from '@nestjs/swagger';
import { CurrencyType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

export class ConversionDto {
  @ApiProperty({
    description: 'The amount of currency to convert',
    example: 1.5,
  })
  @IsNumber()
  @IsNotEmpty()
  value: number;
}
