import { Injectable } from '@nestjs/common';
import { CarrierBuilder } from '../carriers/carrier.builder';
import { ExecuteTrackingDto } from './dto/execute-tracking.dto';
import { Tracking } from './schemas/tracking.schema';
import { TrackingRepository } from './tracking.repository';
import { Carriers } from '../carriers/contracts/tracking-info.contract';

@Injectable()
export class TrackingService {
  constructor(
    private readonly trackingRepository: TrackingRepository,
    private readonly carriersBuilder: CarrierBuilder,
  ) {}

  async execute({ code }: ExecuteTrackingDto): Promise<Tracking> {
    const carrier = this.carriersBuilder.setCarrier(Carriers.Carriers).build();

    const trackingInfo = await carrier.tracking(code);

    return this.trackingRepository.create(trackingInfo);
  }

  async findAll(): Promise<Tracking[]> {
    return this.trackingRepository.findAll();
  }

  async findOne(code: string): Promise<Tracking | null> {
    return this.trackingRepository.findOne(code);
  }
}
