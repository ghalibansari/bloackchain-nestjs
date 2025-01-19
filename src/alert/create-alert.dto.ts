import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { CurrencyType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

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
    example: 'ETH',
  })
  @IsString()
  @IsEnum(CurrencyType)
  type: CurrencyType;
}
