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

  async findAll(): Promise<Tracking[]> {
    return this.trackingModel.find().exec();
  }

  async findOne(code: string): Promise<Tracking | null> {
    return this.trackingModel.findOne({ code }).exec();
  }
}
