import { ApiProperty } from '@nestjs/swagger';
import { CurrencyType } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAlertDto {
  @ApiProperty({
    description: 'The email address to send alerts to',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The threshold value for the alert',
    example: 50000,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @ApiProperty({
    description: 'The currency type for the alert',
    enum: CurrencyType,
    example: CurrencyType.ETH,
  })
  @IsEnum(CurrencyType)
  type: CurrencyType;
}
