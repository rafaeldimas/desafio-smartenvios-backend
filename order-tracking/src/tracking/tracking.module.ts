import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tracking, TrackingSchema } from './schemas/tracking.schema';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { TrackingRepository } from './tracking.repository';
import { CarriersModule } from '../carriers/carriers.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tracking.name, schema: TrackingSchema },
    ]),
    CarriersModule,
  ],
  controllers: [TrackingController],
  providers: [TrackingService, TrackingRepository],
})
export class TrackingModule {}
