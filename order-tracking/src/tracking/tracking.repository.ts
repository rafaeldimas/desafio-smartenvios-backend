import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { Tracking } from './schemas/tracking.schema';

@Injectable()
export class TrackingRepository {
  constructor(
    @InjectModel(Tracking.name) private trackingModel: Model<Tracking>,
  ) {}

  async create(createTrackingDto: CreateTrackingDto): Promise<Tracking> {
    const createdTracking = await this.trackingModel.create(createTrackingDto);
    return createdTracking;
  }

  async update(
    trackingCode: string,
    tracking: Partial<Tracking>,
  ): Promise<Tracking | null> {
    return this.trackingModel
      .findOneAndUpdate({ trackingCode }, tracking, { new: true })
      .exec();
  }

  async findAll(): Promise<Tracking[]> {
    return this.trackingModel.find().exec();
  }

  async findOne(trackingCode: string): Promise<Tracking | null> {
    return this.trackingModel.findOne({ trackingCode }).exec();
  }

  async findTrackingWasNotDelivered(): Promise<Tracking[]> {
    return this.trackingModel.find({ wasDelivered: false }).exec();
  }

  async findTrackingWithEventNotProcessed(): Promise<Tracking[]> {
    return this.trackingModel.find({ 'events.processed': false }).exec();
  }
}
