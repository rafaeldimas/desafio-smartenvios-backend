import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Carriers } from '../../carriers/contracts/tracking-info.contract';

export type TrackingDocument = HydratedDocument<Tracking>;

export interface Event {
  timestamp: string;
  status: string;
  location: string;
  processed: boolean;
}

@Schema()
export class Tracking {
  @Prop()
  trackingCode: string;

  @Prop()
  carrier: Carriers;

  @Prop()
  wasDelivered: boolean;

  @Prop()
  events: Event[];
}

export const TrackingSchema = SchemaFactory.createForClass(Tracking);
