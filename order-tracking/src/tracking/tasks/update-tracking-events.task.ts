import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CarrierBuilder } from '../../carriers/carrier.builder';
import { CarrierContract } from '../../carriers/contracts/carrier.contract';
import {
  Carriers,
  TrackingInfoContract,
} from '../../carriers/contracts/tracking-info.contract';
import { Tracking } from '../schemas/tracking.schema';
import { TrackingRepository } from '../tracking.repository';
import { TrackingNotification } from '../tracking.notification';

@Injectable()
export class UpdateTrackingEventsTask {
  private carriersServices: Record<Carriers, CarrierContract>;
  private logger: Logger = new Logger(UpdateTrackingEventsTask.name);

  constructor(
    private readonly carrierBuilder: CarrierBuilder,
    private readonly trackingRepository: TrackingRepository,
    private readonly trackingNotification: TrackingNotification,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handle() {
    this.logger.log('Starting update tracking');

    const trackings = await this.getTrackings();

    for (const tracking of trackings) {
      const { trackingCode, carrier } = tracking;

      this.logger.log(`Processing update of tracking: ${trackingCode}`);

      const carrierService = this.getCarrierService(carrier);
      const trackingInfo = await carrierService.tracking(trackingCode);

      const trackingUpdated = this.updateTrackingInfo(tracking, trackingInfo);

      await this.trackingRepository.update(trackingCode, trackingUpdated);

      this.logger.log(`Finishing update of tracking: ${trackingCode}`);
    }

    this.logger.log('Finish update tracking');

    await this.trackingNotification.handle();
  }

  private async getTrackings() {
    return this.trackingRepository.findTrackingWasNotDelivered();
  }

  private getCarrierService(carrier: Carriers): CarrierContract {
    this.carriersServices = this.carriersServices || {};

    if (!this.carriersServices[carrier]) {
      this.carriersServices[carrier] = this.carrierBuilder
        .setCarrier(carrier)
        .build();
    }

    return this.carriersServices[carrier];
  }

  private updateTrackingInfo(
    tracking: Tracking,
    trackingInfo: TrackingInfoContract,
  ): Tracking {
    const events = trackingInfo.events.map((event) => {
      const trackingEvent = tracking.events.find(
        (e) => e.status === event.status,
      );

      return trackingEvent || event;
    });

    return { ...tracking, events };
  }
}
