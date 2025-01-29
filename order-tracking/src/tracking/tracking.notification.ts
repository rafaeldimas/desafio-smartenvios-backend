import { Inject, Injectable, Logger } from '@nestjs/common';
import { TrackingRepository } from './tracking.repository';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { Event } from './schemas/tracking.schema';

interface TrackingMessage {
  trackingCode: string;
  timestamp: string;
  status: string;
  location: string;
}

@Injectable()
export class TrackingNotification {
  private readonly logger: Logger = new Logger(TrackingNotification.name);

  constructor(
    private readonly trackingRepository: TrackingRepository,

    @Inject('TRACKING_EVENTS_UPDATE')
    private readonly kafkaClient: ClientKafkaProxy,
  ) {}

  async handle() {
    this.logger.log('Starting notification tracking');

    const trackings = await this.getTrackings();

    for (const tracking of trackings) {
      const { trackingCode, events } = tracking;

      this.logger.log(`Processing notification of tracking: ${trackingCode}`);

      const eventsToUpdate: Event[] = [];

      for (const event of events) {
        const { timestamp, status, location, processed } = event;

        if (processed) {
          eventsToUpdate.push(event);
          continue;
        }

        const trackingMessage: TrackingMessage = {
          trackingCode,
          timestamp,
          status,
          location,
        };

        this.kafkaClient.emit('tracking.events.update', trackingMessage);

        eventsToUpdate.push({ ...event, processed: true });
      }

      await this.updateTrackingEventProcessed(trackingCode, eventsToUpdate);

      this.logger.log(`Finishing notification of tracking: ${trackingCode}`);
    }

    this.logger.log('Finish notification tracking');
  }

  private async getTrackings() {
    return this.trackingRepository.findTrackingWithEventNotProcessed();
  }

  private async updateTrackingEventProcessed(
    trackingCode: string,
    events: Event[],
  ) {
    return this.trackingRepository.update(trackingCode, { events });
  }
}
