import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tracking, TrackingSchema } from './schemas/tracking.schema';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { TrackingRepository } from './tracking.repository';
import { CarriersModule } from '../carriers/carriers.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UpdateTrackingEventsTask } from './tasks/update-tracking-events.task';
import { TrackingNotification } from './tracking.notification';
import { Partitioners } from 'kafkajs';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'TRACKING_EVENTS_UPDATE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            producerOnlyMode: true,
            client: {
              clientId: 'smartenvios.tracking',
              brokers: [
                configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
              ],
            },
            producer: {
              createPartitioner: Partitioners.LegacyPartitioner,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    MongooseModule.forFeature([
      { name: Tracking.name, schema: TrackingSchema },
    ]),
    CarriersModule,
  ],
  controllers: [TrackingController],
  providers: [
    TrackingService,
    TrackingRepository,
    UpdateTrackingEventsTask,
    TrackingNotification,
  ],
})
export class TrackingModule {}
