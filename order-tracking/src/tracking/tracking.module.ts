import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { CarriersModule } from '../carriers/carriers.module';
import { Tracking, TrackingSchema } from './schemas/tracking.schema';
import { UpdateTrackingEventsTask } from './tasks/update-tracking-events.task';
import { TrackingController } from './tracking.controller';
import { TrackingNotification } from './tracking.notification';
import { TrackingRepository } from './tracking.repository';
import { TrackingService } from './tracking.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'ORDER_TRACKING_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'smartenvios',
              brokers: [
                configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
              ],
            },
            consumer: {
              groupId: 'order-tracking-consumer',
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
