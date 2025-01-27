import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ExecuteTrackingDto } from './dto/execute-tracking.dto';
import { TrackingService } from './tracking.service';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post()
  async create(@Body() executeTrackingDto: ExecuteTrackingDto) {
    return this.trackingService.execute(executeTrackingDto);
  }

  @Get()
  async findAll() {
    return this.trackingService.findAll();
  }

  @Get(':code')
  async findOne(@Param('code') code: string) {
    return this.trackingService.findOne(code);
  }
}
