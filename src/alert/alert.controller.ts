import { Body, Controller, Post } from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './create-alert.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('alerts')
@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new alert' })
  @ApiResponse({
    status: 201,
    description: 'The alert has been successfully created.',
    type: CreateAlertDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createAlertDto: CreateAlertDto) {
    return this.alertService.create(createAlertDto);
  }
}
