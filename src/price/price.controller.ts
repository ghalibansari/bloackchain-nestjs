import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConversionDto, PriceType } from './price.dto';
import { PriceService } from './price.service';

@ApiTags('price')
@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch 24-hour price data for a specific currency' })
  @ApiResponse({
    status: 200,
    description: 'Returns the 24-hour price data for the specified currency',
  })
  @ApiResponse({ status: 400, description: 'Invalid currency type provided' })
  async fetchPrice24Hours(@Query() { type }: PriceType) {
    return this.priceService.fetchPrice24Hours(type);
  }

  @Post('conversion/eth/btc')
  @ApiOperation({ summary: 'Convert ETH to BTC' })
  @ApiResponse({
    status: 200,
    description: 'Successful conversion',
    type: ConversionDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid conversion request' })
  async conversion(@Body() body: ConversionDto) {
    return await this.priceService.conversion(body);
  }
}
